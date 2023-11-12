import React, {Fragment, useEffect, useState} from "react";
import Breadcrumb from "../common/breadcrumb";
import Datatable from "../common/datatable";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../helpers";

const Orders = () => {
	const [orders, setOrders] = useState([]);

	const getOrders = async () => {
		const response = await axios.get(`${getApiConfig().baseUrl}/order`, {headers: getApiConfig().headers});
		if (response?.data) {
			for (let index in response.data) {
				delete response.data[index]['orderNumber'];
				delete response.data[index]['productIds'];
				delete response.data[index]['quantity'];
				delete response.data[index]['userId'];
				delete response.data[index]['deliveryAddress'];
				delete response.data[index]['billingAddress'];
				const deliveryAddress = response.data[index]['deliveryAddressModel'];
				const billingAddress = response.data[index]['billingAddressModel'];
				const promotion = response.data[index]['promotion'];

				delete response.data[index]['deliveryAddressModel'];
				delete response.data[index]['billingAddressModel'];
				delete response.data[index]['promotion'];
				delete response.data[index]['promotionId'];

				response.data[index] = {
					id: response.data[index]['id'],
					webRefNo: response.data[index]['webRefNo'],
					deliveryAddress: deliveryAddress?.street + ', ' + deliveryAddress?.city,
					billingAddress: billingAddress?.street + ', ' + billingAddress?.city,
					promotion: `${promotion?.voucherCode} (${promotion?.discount})`,
					price: response.data[index]['price'] + ' RON',
					...response.data[index]
				}

			}
			setOrders(response.data);
		}
	}

	useEffect(() => {
		getOrders();
	}, []);

	return (
		<Fragment>
			<Breadcrumb title="Orders" parent="Sales" />

			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Manage Order</h5>
							</CardHeader>
							<CardBody className="order-datatable">
								{orders.length > 0 && <Datatable
									multiSelectOption={false}
									myData={orders}
									pageSize={10}
									pagination={true}
									class="-striped -highlight"
									objectType={'order'}
								/>}
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default Orders;
