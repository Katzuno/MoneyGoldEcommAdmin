import React, {Fragment, useEffect, useState} from "react";
import Breadcrumb from "../common/breadcrumb";
import data from "../../assets/data/listPages";
import Datatable from "../common/datatable";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../helpers";

const ListPages = () => {
	const [translations, setTranslations] = useState({});

	const getTranslations = async () => {
		const response = await axios.get(`${getApiConfig().baseUrl}/translations`, {headers: getApiConfig().headers});
		setTranslations(response.data);
	}

	useEffect(() => {
		getTranslations();
	}, []);

	return (
		<Fragment>
			<Breadcrumb title="Listare texte" parent="Listare texte" />
			<Container fluid={true}>
				<Row>
					<Col sm="12">
						<Card>
							<CardHeader>
								<h5>Modificare texte</h5>
							</CardHeader>
							<CardBody>
								<div
									id="batchDelete"
									className="category-table order-table coupon-list-delete"
								>
									{translations.length && <Datatable
										multiSelectOption={false}
										myData={translations}
										pageSize={40}
										pagination={false}
										class="-striped -highlight"
										objectType="translation"
									/>}
								</div>
							</CardBody>
						</Card>
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
};

export default ListPages;
