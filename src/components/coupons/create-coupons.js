import React, {Fragment, useEffect, useState} from "react";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import Breadcrumb from "../common/breadcrumb";
import Tabset from "./tabset";
import axios from "axios";
import {getApiConfig} from "../../helpers";

const Create_coupons = () => {

	const [loadedPromotion, setLoadedPromotion] = useState(null);

	const getPromotions = async (id) => {
		const response = await axios.get(`${getApiConfig().baseUrl}/promotions/${id}`, {headers: getApiConfig().headers});
		if (response?.data) {
			console.log(response.data);
			setLoadedPromotion(response.data);
		}

	}

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		if (id) {
			getPromotions(id);
		}
	}, []);

	return (
		<Fragment>
			<Breadcrumb title="Create Coupon" parent="Coupon" />
			<Container fluid={true}>
				<Card>
					<CardHeader>
						<h5>Promotion Details</h5>
					</CardHeader>
					<CardBody>
						<Tabset objectInfo={loadedPromotion}/>
					</CardBody>
				</Card>
			</Container>
		</Fragment>
	);
};

export default Create_coupons;
