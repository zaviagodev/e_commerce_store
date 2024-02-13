import frappe
import frappe.defaults
from frappe import _, throw
from frappe.contacts.doctype.contact.contact import get_contact_name
from webshop.webshop.shopping_cart.cart import get_party, get_address_docs
from webshop.webshop.utils.product import get_web_item_qty_in_stock
from erpnext.accounts.doctype.loyalty_program.loyalty_program import (
    get_loyalty_details,
)
from frappe.utils import cint


@frappe.whitelist()
def get_addresses():
    return get_address_docs()

@frappe.whitelist(allow_guest=True)
def get_websiteSettings():
    settings = frappe.get_doc("Storefront Website Settings")
    payment_methods = []

    if settings.enable_promptpay_qr == 1:
        payment_info = {
            'name': settings.payment_method_title,
            'key': 1,
            'promptpay_qr_image': settings.upload_your_promptpay_qr_image,
            'account_name': settings.promptpay_account_name,
            'promptpay_number': settings.promptpay_number
        }
        payment_methods.append(payment_info)
        
    if settings.enable_bank_transfer == 1:
        banks_list = frappe.get_all("Payment channel", filters={"parent": "Storefront Website Settings"}, fields=["bank","bank_account_name","bank_account_number"])
        payment_info = {
            'name': settings.bank_title,
            'key': 2,
            'banks_list': banks_list
        }
        payment_methods.append(payment_info)
        
    return {
        "settings": settings,
        "payment_settings": payment_methods
    }



@frappe.whitelist()
def get_profile():
    user_name = frappe.session.user
    user = frappe.get_doc("User", user_name)
    profile = get_party().as_dict()
    
    dd = frappe.session.user
    customer = frappe.get_all("Customer", fields=['name'], filters={"email_id": dd} )
    if customer:
        customer = customer[0]['name']
    else:
        customer = profile.customer_name
    
    
    points = get_loyalty_details(customer, profile.loyalty_program)
    return {
        **profile,
        **points,
        "user": user
        
    }

@frappe.whitelist()
def update_profile(
    first_name: str = None,
    last_name: str = None,
    email: str = None,
    birth_date: str = None
): 
    # update user
    user_name = frappe.session.user
    user = frappe.get_doc("User", user_name).update({
        "first_name": first_name if first_name else None,
        "last_name": last_name if last_name else None,
        "email": email if email else None,  
        "birth_date": birth_date if birth_date else None,
    })
    user.save(ignore_permissions=True)
    
    
    # update contact
    contact = frappe.get_last_doc("Contact", filters={
        "user": user.name
    }).update({
        "first_name": first_name if first_name else None,
        "last_name": last_name if last_name else None,
        "email_id": email if email else None,
    })
    
    # update Customer
    if contact.links and contact.links[0].link_doctype == "Customer":
        customer_name = contact.links[0].link_name
        customer = frappe.get_doc("Customer", customer_name).update({
            "doctype": "Customer",
            "name": customer_name,
            "customer_name": f"{first_name} {last_name}" if first_name or last_name else None,
            "customer_details": f"birth_date: {birth_date}",
            "customer_primary_contact": contact.name,
        })
        
        customer.save(ignore_permissions=True)
        contact.save(ignore_permissions=True)
        
    return get_profile()


@frappe.whitelist()
def get_loyalty_points_details():
    party = get_party()
    lp_record = frappe.get_all("Loyalty Point Entry", filters={"customer": party.name}, fields=["*"])
    return {
        **get_loyalty_details(party.customer_name, party.loyalty_program),
        "record": lp_record
    }

@frappe.whitelist()
def place_order(items: list, billing_address: str = None, shipping_address: str = None, branch: str = None, loyalty_points: int = 0, shipping_method: str = None, payment_method: int = 0):
    party = get_party()
    cart_settings = frappe.db.get_value(
        "Webshop Settings", None, ["company", "allow_items_not_in_stock"], as_dict=1
    )

    # if not (party.customer_primary_address):
    # 	frappe.throw(_("Set Shipping Address or Billing Address"))
    
    if not cint(cart_settings.allow_items_not_in_stock):
        for item in items:
            is_stock_item = frappe.db.get_value("Item", item.get("item_code"), "is_stock_item")

            if is_stock_item:
                item_stock = get_web_item_qty_in_stock(item.get("item_code"), "website_warehouse")
                if not cint(item_stock.in_stock):
                    frappe.throw(_("{0} Not in Stock").format(item.get("item_code")))
                if item.get("qty") > item_stock.stock_qty[0][0]:
                    throw(_("Only {0} in Stock for item {1}").format(item_stock.stock_qty[0][0], item.get("item_code")))
    
    # make sure to pass only item_code & qty
    parsed_items = map(lambda item: {
        "item_code": item.get("item_code"),
        "qty": item.get("qty"),
        "warehouse": frappe.db.get_value("Website Item", {"item_code": item.get("item_code")}, "website_warehouse")
    }, items)
    sale_invoice = frappe.get_doc(
        {
            "doctype": "Sales Invoice",
            "customer": party.name,
            "branch": branch,
            "items": parsed_items,
            "customer_address": billing_address,
            "shipping_address_name": shipping_address or billing_address,
            "shipping_rule": shipping_method,
            "custom_payment_method": payment_method,
            "redeem_loyalty_points": 1 if loyalty_points else 0,
            "loyalty_points": int(loyalty_points) if loyalty_points else None,
            "docstatus": 1
        }
    ).insert(ignore_permissions=True)

    return sale_invoice.as_dict()

@frappe.whitelist()
def add_address(address_line1: str,address_title: str, city: str, country: str, address_type="Billing", state=None, pincode=None,  phone=None, email_id=None, address_line2=None, is_shipping_address=0, is_primary_address=0):
    party = get_party()
    address = frappe.get_doc(
        {
            "doctype": "Address",
            "address_title": address_title,
            "address_type": address_type,
            "address_line1": address_line1,
            "address_line2": address_line2,
            "city": city,
            "state": state,
            "country": country,
            "pincode": pincode,
            "phone": phone,
            "email_id": email_id,
            "is_primary_address": is_primary_address,
            "is_shipping_address": is_shipping_address,
            "disabled": 0,
            "is_your_company_address": 0,
            "links": [],
        }
    )
    address.insert(ignore_permissions=True)

    if(not party.customer_primary_address or is_primary_address):
        party.customer_primary_address = address.name
        party.primary_address = f"{address.address_line1}\n{address.city}\n{address.country}"
        party.save(ignore_permissions=True)

    return address.as_dict()

@frappe.whitelist()
def get_countries(city =None, state =None):
    countries = frappe.get_all("Country", fields=["name"])

    if city:
        countries = frappe.get_doc("City", city).country

    if state:
        countries = frappe.get_doc("State", state).country_name
    
    return countries.as_dict()


@frappe.whitelist()
def get_states(country=None, city=None):
    states = frappe.get_all("State", fields=["state_name"])

    if country:
        states = frappe.get_all("State", filters={"country_name": country}, fields=["state_name"])

    if city:
        states = frappe.get_doc("City", city).state_name

    return states.as_dict()

@frappe.whitelist()
def get_cities(state=None, country=None):
    cities = frappe.get_all("City", fields=["city_name"])

    if state:
        cities = frappe.get_all("City", filters={"state_name": state}, fields=["city_name"])

    if country:
        cities = frappe.get_all("City", filters={"country_name": country}, fields=["city_name"])

    return cities.as_dict()



