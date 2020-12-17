import React, { useEffect, useState } from 'react';
import { Placeholder, Table } from 'semantic-ui-react';
import { Client, Product } from '../clients/server.generated';
import { ProductRow } from './ProductRow';

export function ProductsTable() {
  const [products, setProducts] = useState([] as Product[]);

  useEffect(() => {
    const fetchProducts = async () => {
      const client = new Client();
      setProducts(await client.getProducts());
    };

    fetchProducts();
  }, []);

  return (
    <Table singleLine>
      <Table.Header>
        <Table.HeaderCell>Name</Table.HeaderCell>
        <Table.HeaderCell>Target price</Table.HeaderCell>
      </Table.Header>
      <Table.Body>
        {products.map((x) => <ProductRow product={x} />)}
      </Table.Body>
    </Table>
  );
}
