import frappe
from frappe.permissions import add_permission, update_permission_property

install_docs = [
        {
            "doctype": "Role",
            "name": "E-Commerce Manager",
            "role_name": "E-Commerce Manager",
            "is_custom": 1,
            "desk_access": 1,
            "search_bar": 1,
            "notifications": 1,
            "list_sidebar": 1,
            "bulk_actions": 1,
            "view_switcher": 1,
            "form_sidebar": 1,
            "timeline": 1,
            "dashboard": 1,
        },
        {
            "doctype": "Role Profile",
            "name": "E-Commerce Manager",
            "role_profile": "E-Commerce Manager",
            "roles": [{"role": "E-Commerce Manager"}],
        }
    ]

role_permissions_map = {
    "E-Commerce Manager": [
        {
            "doctype": "Sales Order",
            "permlevel": 0,
            "rights": ["read", "write"]
        }
    ]
}

def after_install():
    for d in install_docs:
        try:
            frappe.get_doc(d).insert(ignore_if_duplicate=True)
        except frappe.NameError:
            pass
    
    add_permissions()
    frappe.get_single("Webshop Settings").update({
        "products_per_page": 100,
        "show_price": 1,
        "show_stock_availability": 1,
        "allow_items_not_in_stock": 1,
        "enabled": 1,
        "price_list": "Standard Selling",
        "quotation_series": "SAL-QTN-.YYYY.-",
        "default_customer_group": "All Customer Groups",
    }).save()

    frappe.get_single("Webshop Settings").update({
        "products_per_page": 100,
        "show_price": 1,
        "show_stock_availability": 1,
        "allow_items_not_in_stock": 1,
        "enabled": 1,
        "price_list": "Standard Selling",
        "quotation_series": "SAL-QTN-.YYYY.-",
        "default_customer_group": "All Customer Groups",
    }).save()

def add_permissions():
    roles = [d for d in install_docs if d.get("doctype") == "Role"]
    for role in roles:
        for perm in role_permissions_map.get(role.get("role_name"), []):
            doctype = perm.get("doctype")
            permlevel = perm.get("permlevel")
            rights = perm.get("rights")
            add_permission(doctype, role.get("role_name"), permlevel)
            for right in rights:
                update_permission_property(doctype, role.get("role_name"), permlevel, right, 1)

def remove_permissions():
    roles = [d for d in install_docs if d.get("doctype") == "Role"]
    for role in roles:
        permissions = frappe.get_all("Custom DocPerm", filters={"role": role.get("role_name")}, fields=["name"])
        for perm in permissions:
            frappe.delete_doc_if_exists("Custom DocPerm", perm.get("name"))

def before_uninstall():
    remove_permissions()
    for d in install_docs:
        try:
            frappe.delete_doc(d.get("doctype"), d.get("name"), True)
        except:
            print(frappe.get_traceback())