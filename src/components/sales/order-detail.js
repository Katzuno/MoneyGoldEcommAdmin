import React, {Fragment, useEffect, useState} from "react";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import Breadcrumb from "../common/breadcrumb";
import axios from "axios";
import {getApiConfig} from "../../helpers";
import Tabset from "../coupons/tabset";
import OrderTabset from "./order-tabset";

const OrderDetail = () => {

	const [loadedOrder, setLoadedOrder] = useState(null);

	const getOrder = async (id) => {
		const response = await axios.get(`${getApiConfig().baseUrl}/order/${id}`, {headers: getApiConfig().headers});
		if (response?.data) {
			console.log(response.data);
			setLoadedOrder(response.data);
		}

	}

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		if (id) {
			getOrder(id);
		}
	}, []);

	return (
		<Fragment>
			<Breadcrumb title="Detalii comanda" parent="Comenzi" />
			<Container fluid={true}>
				<Card>
					<CardHeader>
						<h5>Detalii Comanda</h5>
					</CardHeader>
					<CardBody>
						{loadedOrder && <OrderTabset objectInfo={loadedOrder}/>}
					</CardBody>
				</Card>
			</Container>
		</Fragment>
	);
};

export default OrderDetail;
