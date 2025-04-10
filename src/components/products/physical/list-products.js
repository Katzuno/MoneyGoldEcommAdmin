import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumb, Card, CardBody, CardHeader, Col, Container, Row, Button } from "reactstrap";
import axios from "axios";
import { getApiConfig } from "../../../helpers";
import Datatable from "../../common/datatable";
import * as XLSX from "xlsx";

const ListProducts = () => {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/articles`, { headers: getApiConfig().headers });
        if (response?.data) {
            for (let index in response.data) {
                delete response.data[index]['ID_Produs'];
                response.data[index] = {
                    image: <img alt="" src={response.data[index]['Imagine']} style={{ width: 100, height: 100 }} />,
                    id: response.data[index]['id'],
                    Nume: response.data[index]['Nume'],
                    ...response.data[index]
                };
            }
            setProducts(response.data);
        }
    };
    const exportToXLSX = () => {
        if (products.length === 0) return;

        // List of keys (columns) to be used as headers in the XLSX file
        const headers = [
            "id", "Nume", "CodCS", "Denumire", "Lungime", "Latime", "Marime", "Extensie",
            "CuloarePiatra", "Nivel1", "Nivel2", "Nivel3", "Nivel4", "CuloareAur", "Carataj",
            "MaterialAuxiliar", "SistemInchidere", "TipPiatra", "Subtitlu", "ScurtaDescriere",
            "Descriere", "Imagine", "Imagine2", "Imagine3", "Imagine4", "Imagine5",
            "PretWebshop", "Stoc", "vizibilSite", "GramajMinim", "Categorie", "Subcategorie",
            "idParinte", "createdAt", "updatedAt"
        ];

        // Convert product data into an array of objects matching the headers
        const rows = products.map((product) => {
            const row = {};
            headers.forEach((header) => {
                row[header] = product[header] !== undefined ? product[header] : "";
            });
            return row;
        });

        // Create a worksheet from the data
        const worksheet = XLSX.utils.json_to_sheet(rows, { header: headers });

        // Create a workbook and append the worksheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

        // Export the workbook to an XLSX file
        XLSX.writeFile(workbook, "products.xlsx");
    };
    useEffect(() => {
        getProducts();
    }, []);

    return (
        <Fragment>
            <Breadcrumb title="List Products" parent="Products" />
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardHeader>
                                <h5>Products
                                    &nbsp;&nbsp;<Button color="primary" onClick={exportToXLSX}>
                                        Export to XLSX
                                    </Button></h5>
                            </CardHeader>
                            <CardBody>
                                <div id="batchDelete" className="category-table order-table coupon-list-delete">
                                    {products.length > 0 && (
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={products}
                                            pageSize={10}
                                            pagination={true}
                                            class="-striped -highlight"
                                            objectType={"product"}
                                        />
                                    )}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

export default ListProducts;
