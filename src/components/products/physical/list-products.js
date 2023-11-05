import React, {Fragment, useEffect, useState} from "react";
import {Breadcrumb, Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../../helpers";
import Datatable from "../../common/datatable";

const ListProducts = () => {
    const [products, setProducts] = useState([]);

    const getPromotions = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/articles`, {headers: getApiConfig().headers});
        if (response?.data) {
            setProducts(response.data);
        }
    }

    useEffect(() => {
        getPromotions();
    }, []);


    return (
        <Fragment>
            <Breadcrumb title="List Products" parent="Products"/>
            <Container fluid={true}>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardHeader>
                                <h5>Promotions</h5>
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
