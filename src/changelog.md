# Change log
The current version of ParelPracht is **v0.1-beta1**, released on February 1st, 2021.
You can find the release notes below.
----------------------

## v0.2-dev
### Added
- Added custom invoices with custom values.
  - Added support for a custom list of products (With amounts).
  - Added support for a custom recipient.
- Added an insights tab with a bar chart to the product details page.
  - The bar chart shows the value of all contracted products by financial year.
  - The bar chart shows the number of contracted products by financial year.
- Added an insights tab with a bar chart to the company details page.
  - The bar chart shows the value of all contracted products by that company by financial year.
  - The bar chart shows the number of contracted products by that company by financial year.
- Added company logos, which can be uploaded from their respective company pages.
  - The logos are also shown on the company's contracts and invoices.
- Added user avatars, which can be uploaded from your own user page.
  - The avatars are also shown in every activity feed.
  - The avatar is used in the main menu.
- Added a button to the user details page, which can be used to transfer all your assignments to a different user.
- Added a reply-to email address for users, which will be used in contracts.
- Invoices can now be marked as irrecoverable.
- Added a GEWIS logo to the login page of ParelPracht.

### Changes
- The list of recent contracts on the dashboard now only shows your own assigned contracts, except for admins.
- Cancel and Defer buttons for entity statuses are now disabled when the entity is "finished" (so no more statusses are possible).
- Selecting signees when creating a contract proposal is disabled and thus no longer necessary.
- All emails sent by ParelPracht are now nicely formatted.

### Bugfixes
- Fixed not being able to select a recipient when generating an invoice file.
- Fixed the "Invoiced" bar on the dashboard always being zero.
- Fixed the generate modal being closed when generating a document fails.
- Fixed a memory leak in the front-end when uploading the first file to an entity.
- Fixed the diamond underneath a selected tab being black instead of blue.
- Fixed not being able to update the details of a product in a contract.
- Fixed a product in a contract still being selected after removing this product from the contract.
- Fixed most of the errors from the browser console.
- Fixed user function not being required in the front-end, while it was required in the back-end.
- Fixed a store error showing up when you log out.

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
