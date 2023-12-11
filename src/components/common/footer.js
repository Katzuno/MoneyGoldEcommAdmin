import React from "react";
import { Col, Container, Row } from "reactstrap";

const Footer = () => {
	return (
		<div>
			<footer className="footer">
				<Container fluid={true}>
					<Row>
						<Col md="6" className="footer-copyright">
							<p className="mb-0">
								Copyright 2023 © MoneyGold All rights reserved.
							</p>
						</Col>
						<Col md="6">
							<p className="pull-right mb-0">
								Developed by IT HIT
							</p>
						</Col>
					</Row>
				</Container>
			</footer>
		</div>
	);
};

export default Footer;
