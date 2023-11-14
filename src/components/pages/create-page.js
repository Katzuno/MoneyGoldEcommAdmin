import React, {Fragment, useEffect, useState} from "react";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
import Breadcrumb from "../common/breadcrumb";
import TabsetPage from "./tabset-page";
import {getApiConfig} from "../../helpers";
import axios from "axios";

const Create_page = () => {
	const [loadedTranslation, setLoadedTranslation] = useState(null);

	const getTranslations = async (id) => {
		const response = await axios.get(`${getApiConfig().baseUrl}/translations/${id}`, {headers: getApiConfig().headers});
		if (response?.data) {
			setLoadedTranslation(response.data);
		}
	}

	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const id = params.get('id');
		if (id) {
			getTranslations(id);
		}
	}, []);


	return (
		<Fragment>
			<Breadcrumb title="Create Page" parent="Pages" />
			<Container fluid={true}>
				<Card>
					<CardHeader>
						<h5>Editare text</h5>
					</CardHeader>
					<CardBody>
						<TabsetPage objectInfo={loadedTranslation}/>
					</CardBody>
				</Card>
			</Container>
		</Fragment>
	);
};

export default Create_page;
