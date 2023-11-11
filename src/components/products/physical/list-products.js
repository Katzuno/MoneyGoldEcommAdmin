import React, {Fragment, useEffect, useState} from "react";
import {Breadcrumb, Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../../helpers";
import Datatable from "../../common/datatable";
import pro16 from "../../../assets/images/dashboard/product/1.jpg";

const ListProducts = () => {
    const [products, setProducts] = useState([]);

    const getProducts = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/articles`, {headers: getApiConfig().headers});
        if (response?.data) {
            for (let index in response.data) {
                delete response.data[index]['ID_Produs'];
                response.data[index] = {
                        image: <img alt="" src={response.data[index]['Imagine']} style={{width: 100, height: 100}}/>,
                        id: response.data[index]['id'],
                        Nume: response.data[index]['Nume'],
                        ...response.data[index]
                    }
            }
            setProducts(response.data);
        }
    }

    useEffect(() => {
        getProducts();
    }, []);


    return (
        <Fragment>
            <Breadcrumb title="List Products" parent="Products"/>
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardHeader>
                                <h5>Products</h5>
                            </CardHeader>
                            <CardBody>
                                <div
                                    id="batchDelete"
                                    className="category-table order-table coupon-list-delete"
                                >
                                    {products.length > 0 && (
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={products}
                                            pageSize={10}
                                            pagination={true}
                                            class="-striped -highlight"
											objectType={'product'}
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
