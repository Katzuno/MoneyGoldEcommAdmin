import React, {Fragment, useEffect, useState} from "react";
import Breadcrumb from "../common/breadcrumb";
import data from "../../assets/data/listCoupons";
import Datatable from "../common/datatable";
import {Card, CardBody, CardHeader, Col, Container, Row} from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../helpers";

const ListCoupons = () => {
    const [promotions, setPromotions] = useState([]);

    const getPromotions = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/promotions`, {headers: getApiConfig().headers});
        if (response?.data) {
            for (let index in response.data) {
				response.data[index].isActive = response.data[index].isActive ? 'Active' : 'Inactive';
			}
            setPromotions(response.data);
        }
    }

    useEffect(() => {
        getPromotions();
    }, []);


    return (
        <Fragment>
            <Breadcrumb title="List Promotions" parent="Promotions"/>
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
                                    {promotions.length > 0 && (
                                        <Datatable
                                            multiSelectOption={false}
                                            myData={promotions}
                                            pageSize={10}
                                            pagination={true}
                                            class="-striped -highlight"
											objectType={'promotion'}
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

export default ListCoupons;
