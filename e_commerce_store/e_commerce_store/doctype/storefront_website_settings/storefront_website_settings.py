# Copyright (c) 2024, Zaviago and contributors
# For license information, please see license.txt

# import frappe
from frappe.model.document import Document
import frappe

class StorefrontWebsiteSettings(Document):
	pass


def get_website_settings():
	website_settings = frappe.get_doc("Storefront Website Settings", "Storefront Website Settings")
	return website_settings