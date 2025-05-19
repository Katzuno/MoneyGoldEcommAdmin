import React, {Fragment, useEffect, useState} from "react";
import Breadcrumb from "../common/breadcrumb";
import data from "../../assets/data/listPages";
import Datatable from "../common/datatable";
import { Card, CardBody, CardHeader, Col, Container, Row, Input, InputGroup, FormGroup, Label } from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../helpers";

const ListPages = () => {
	const [translations, setTranslations] = useState({});
	const [searchQuery, setSearchQuery] = useState("");
	const [filteredTranslations, setFilteredTranslations] = useState([]);

	const getTranslations = async () => {
		const response = await axios.get(`${getApiConfig().baseUrl}/translations`, {headers: getApiConfig().headers});

		for (let translation of response.data) {
			delete translation['createdAt'];
			delete translation['updatedAt'];
			// delete translation['id'];
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
		setFilteredTranslations(response.data);
	}

	// Filter translations based on search query
	const handleSearch = (e) => {
		const query = e.target.value.toUpperCase();
		setSearchQuery(query);

		if (!query) {
			setFilteredTranslations(translations);
			return;
		}

		const filtered = translations.filter(item => {
			console.log(item.stringIdentifier.toUpperCase().includes(query), item.stringIdentifier, query);
			return item.stringIdentifier.toUpperCase().includes(query)
		});

		setFilteredTranslations(filtered);
	};

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
								<Row className="mb-3">
									<Col md="4">
										<FormGroup>
											<Label htmlFor="search">Căutare:</Label>
											<Input
												type="text"
												id="search"
												placeholder="Introduceți textul pentru căutare..."
												value={searchQuery}
												onChange={handleSearch}
											/>
										</FormGroup>
									</Col>
								</Row>
								<div
									id="batchDelete"
									className="category-table order-table coupon-list-delete"
								>
									{filteredTranslations.length > 0 ? (
										<Datatable
											key={JSON.stringify(filteredTranslations)}
											multiSelectOption={false}
											myData={filteredTranslations}
											pageSize={40}
											pagination={false}
											class="-striped -highlight"
											objectType="translation"
										/>
									) : (
										<div className="text-center p-4">
											{searchQuery ? "Nu s-au găsit rezultate pentru căutarea efectuată." : "Se încarcă datele..."}
										</div>
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

export default ListPages;
