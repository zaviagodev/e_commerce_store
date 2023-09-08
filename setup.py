from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in e_commerce_store/__init__.py
from e_commerce_store import __version__ as version

setup(
	name="e_commerce_store",
	version=version,
	description="provides an e-commerce storefront & functionalities.",
	author="Zaviago",
	author_email="john@zaviago.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
