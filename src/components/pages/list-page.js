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

		for (let translation of response.data) {
			delete translation['createdAt'];
		}

		// Sort translations first by key "page" and then by key "stringIdentifier"
		response.data.sort((a, b) => {
			if (a.page < b.page) {
				return -1;
			}
			if (a.page > b.page) {
				return 1;
			}
			if (a.stringIdentifier < b.stringIdentifier) {
				return -1;
			}
			if (a.stringIdentifier > b.stringIdentifier) {
				return 1;
			}
			return 0;

		});
		console.log('translations', response.data);
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
