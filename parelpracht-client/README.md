<h1 style="text-align: center">
  <img alt="" src="https://raw.githubusercontent.com/GEWIS/parelpracht-client/develop/public/ParelPracht-blacksvg.svg?raw=true" style="width: 25%">
  <br>
  ParelPracht
</h1>

ParelPracht is the successor of Goudglans, the custom Customer Relation Management system of Study Association GEWIS.
This new system is built during the second lockdown of the corona pandemic.
Its main goal is to automate tedious tasks and to keep a clear and concise overview of the current collaborations.
This is achieved by creating nice structured insights tables and graphs and automating the generation of contracts, proposals and invoices.

This is the front-end of ParelPracht. [The back-end can be found here](https://github.com/GEWIS/parelpracht-server).

## Installation
1. Clone the repository.
2. Run `npm install`.
3. Run `npm run start`. This runs the client in development mode. You can view it at [http://localhost:3000](http://localhost:3000).

You can also build the application with `npm run build`. This puts a production build in the `./build` directory.

## Deployment
1. Clone the repository in a folder called `parelpracht-client` and clone the backend repository in a folder called `parelpracht-server`. Make sure that both folders are in the same parent folder.
2. Change the image locations to the correct locations in `docker-compose.yml` (for both the frontend and backend).
3. Fill in the correct (environment) variables in `docker-compose.yml`.
4. Run `docker-compose` in `./parelpracht-client`.

## Copyright

Copyright © 2022 The 39th board of GEWIS - Some rights reserved. Created by Roy Kakkenberg, Koen de Nooij, Jealy van den
Aker, Max Opperman, Wouter van der Heijden en Irne Verwijst. You can use our software freely within the limits of
our license. However, we worked very hard on this project and invested a lot of time in it, so we ask you to leave our
copyright mark in place when modifying our software. Of course, you are free to add your own.

## License
[GNU AGPLv3](./LICENSE)
