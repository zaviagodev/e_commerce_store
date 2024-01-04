# Copyright (c) 2024, Zaviago and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe

class StorefrontWebsiteSettings(Document):
	pass


def get_website_settings():
	website_settings = frappe.get_all("Shipping Rule", filters={"custom_show_on_website": 1}, fields=["name","shipping_rule_type","shipping_amount"])
	return website_settings