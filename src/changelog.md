# Change log
The current version of ParelPracht is **v0.1-beta1**, released on February 1st, 2021.
You can find the release notes below.
----------------------

## v0.2-dev
### Added
Nothing (yet)...

### Changes
Nothing (yet)...

### Bugfixes
Nothing (yet)...

## v0.1-beta1 (01-02-2021)
### Added
The first version! It is hard to write changes here, because basically everything is a change compared to nothing.
But maybe a short list of items is always handy (especially in the future):
- Added products with both Dutch and English attributes.
  - Added files and activities to products.
  - Added relational tables 'contracts' and 'invoices'.
- Added product categories, to order all products nicely.
- Added companies with both "normal" and "invoice" address information.
  - Added activities to companies.
  - Added relational tables 'contracts' and 'invoices'.
- Added contacts to companies. Contacts have their own status for their position within the cooperation and their own contact information.
- Added contracts, which are assigned to a user.
  - Added products to contracts. Products are instanced and can have a discount, which can optionally be shown on PDF contracts.
    - Added activities and statuses to products in contracts.
  - Added files, activities and statuses to contracts.
- Added invoices, which are assigned to a user and contain an optional PO number.
  - Added products to invoices. Invoices can only be created by selecting a set of products in a contract. Products can also later be added to not-yet-sent invoices.
  - Added files, activities and statuses to invoices.
- Added users with roles.
- Added generating PDF or TEX files from contracts and invoices.
  - Added the option to save them in ParelPracht.
- Added the option to always return to the initial state of ParelPracht by removing invoices, contracts, companies and products.
- Added sorting, filtering and searching to all tables.
- Added a large *Insights* table, which contains a list of all instanced products and some information about them.
- Added a dashboard, which gives a quick overview on the current contracts and invoices.

And much, much more!
