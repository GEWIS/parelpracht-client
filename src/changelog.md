# Change log
The current version of ParelPracht is **v0.2.1-beta2**, released on March 7nd, 2021.
You can find the release notes below.
----------------------

## v0.3-dev
### Added
- Added front-end authorization. Certain elements are now only visible to people that can access them in the back-end as well.
- Added a pricing table for products.
  - This table is optional and completely customizable.
  - Data is stored in a JSON format, so linking it with other applications is possible.
- Added support for the MariaDB / MySQL database system.
- Added API keys.
  - Every user can generate at most one API key and use them in the header of their request to authenticate.
  - When generating or deleting an API key, the user is emailed about this operation.
- Added custom personal user backgrounds.
- Added more success notifications when operations have been executed successfully.
- Added a fancy animation on the login page.
- Added a "Remember me" button when logging in.
- Added a total sum and number of products on the resulting query of the Insights table.
- Added the value of contracts and invoices to their respective tables.
- Added input validation on the pricing fields in product instances.
- Added nice-looking minimal and maximal target lines in the Insights chart of products.
- Added optimizations regarding the requests to the backend when creating, deleting or updating entities.

### Changes
- Made the footer smaller and removed the 1px white line in Chrome
- After changing your email address, you can log in with your new email address instead of your old one.
- When selecting a signee for generating a contract, only users with the role "Signee" can be selected.
- When selecting an assigned-to-user, only users with the role "General" can be selected.
- Users without roles can no longer log in.
- The actual/real price can no longer be edited for products within contracts, to prevent floating point errors or inconsistencies.
- When an entity has no files, it is properly displayed (just like contracts and invoices).
- The footer is now a bit smaller to make it less "present".
- When an entity is reloaded, it is now done silently in the background, without the page "jumping" all over the place.
- TextArea fields are now scrollable.
- Deferred products now have their own bar in the next financial year in the Product Insights chart.
- Relational attributes and prices are formatted a lot more nicely when used in attribute-changed-activities.
- A product of an existing product instance can no longer be edited.
- When going back (with the browser back button) to a single entity page, the correct tab is opened again.
- Add different icons for different types of files.
- Add avatar in clickable user references.
- Add favicon.

### Bugfixes
- Fixed page numbers showing "???" in generated PDF files.
- Fixed diamond underneath tabs being black on hover.
- Fixed long company, contract or invoice names causing visual issues with the company's logo.
- Fixed creating a product with a price of 0 euros throwing an error in the backend.
- Fixed layout errors in the large Insights table.
- Fixed not being able to update product instances.
- Fixed prices separated with a comma not being saved properly.
- Fixed returning to an empty list when removing the last entity in a paginated list.
- Fixed footer being positioned one pixel too high in Google Chrome.
- Fixed inconsistencies when multiple people use ParelPracht and update entities.
- Fixed "Add product" button in contracts staying enabled when a contract is marked as confirmed, until ParelPracht is refreshed.
- Fixed login in with Gmail addresses due to dots inconsistencies.
- Fixed deletion of images to preserve disk space.

## v0.2.1-beta2 (07-03-2021)

### Bugfixes
- Fixed being unable to log in when using the Docker version of ParelPracht
- Fixed a bug when the front-end crashed when trying to create a new user.

## v0.2-beta2 (02-03-2021)
### Added
- Added custom invoices with custom values.
  - Added support for a custom list of products (With amounts).
  - Added support for a custom recipient.
- Added a minimal and maximal target to products.
- Added an insights tab with a bar chart to the product details page.
  - The bar chart shows the value of all contracted products by financial year.
  - The bar chart shows the number of contracted products by financial year.
  - The targets are also shown in these charts for comparison.
- Added an insights tab with a bar chart to the company details page.
  - The bar chart shows the value of all contracted products by that company by financial year.
  - The bar chart shows the number of contracted products by that company by financial year.
- Added company logos, which can be uploaded from their respective company pages.
  - The logos are also shown on the company's contracts and invoices.
- Added user avatars, which can be uploaded from your own user page.
  - The avatars are also shown in every activity feed.
  - The avatar is used in the main menu.
- Added new activities which will all be created automatically.
  - Added an activity for when one changes an entity's details.
  - Added an activity for when one changes the assignment of a contract or invoice.
  - Added an activity for when one adds products to a contract.
  - Added an activity for when one removes a product from a contract.
- Treasurers will receive an email with an invoice, when this invoice has been marked as "Sent".
  - This is optional and has to be enabled in the User props.
- Added a button to the user details page, which can be used to transfer all your assignments to a different user.
- Added a reply-to email address for users, which will be used in contracts.
  - Optionally, ParelPracht will send non-authentication related emails to this email address.
- Invoices can now be marked as irrecoverable.
- Added a GEWIS logo to the login page of ParelPracht.

### Changes
- The list of recent contracts on the dashboard now only shows your own assigned contracts, except for admins.
- Cancel and Defer buttons for entity statuses are now disabled when the entity is "finished" (so no more statusses are possible).
- Selecting signees when creating a contract proposal is disabled and thus no longer necessary.
- All emails sent by ParelPracht are now nicely formatted.
- It is no longer possible to create empty comments.
- When you delete an entity, you will now be properly redirected to prevent empty pages and infinite loading.
- The "Updated At" value of every entity will now be updated when an activity is added.
- The "Save" button is disabled when a form has errors.

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
- Fixed slow performance of the company details and "Create Company" modal.
- Fixed delete popup not being visible when in a modal.
- Fixed the placeholder text of some dropdowns being red or black instead of grey.
- Fixed more browser errors.

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
