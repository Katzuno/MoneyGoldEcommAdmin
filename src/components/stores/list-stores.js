import React, {Fragment, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../common/breadcrumb";
import Datatable from "../common/datatable";
import { Card, CardBody, CardHeader, Container, Modal, ModalHeader, ModalBody } from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../helpers";

const List_stores = () => {
	const [stores, setStores] = useState(null);
	const [imageModal, setImageModal] = useState({ isOpen: false, imageUrl: '', alt: '' });

	const handleDataChange = (updatedData) => {
		setStores(updatedData);
	};

	const openImageModal = (imageUrl, alt) => {
		setImageModal({ isOpen: true, imageUrl, alt });
	};

	const closeImageModal = () => {
		setImageModal({ isOpen: false, imageUrl: '', alt: '' });
	};

	const getStores = async () => {
		try {
			let response = await axios.get(`${getApiConfig().baseUrl}/store`, {headers: getApiConfig().headers});
			if (response?.data && Array.isArray(response.data)) {
				// Add image preview column showing both MainImage and AdditionalImages
				const storesWithImages = response.data.map(store => {
					// Create a clean store object without properties that can't be rendered
					const { AdditionalImages, ...cleanStore } = store;

					return {
						image: (
							<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
								{/* Main Image */}
								{store.MainImage ? (
									<img
										alt="Main"
										src={store.MainImage}
										style={{width: 60, height: 60, objectFit: 'cover', borderRadius: '4px', cursor: 'pointer'}}
										title="Click to view full size"
										onClick={() => openImageModal(store.MainImage, 'Main Image')}
									/>
								) : (
									<div style={{
										width: 60,
										height: 60,
										backgroundColor: '#f8f9fa',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										border: '1px solid #dee2e6',
										borderRadius: '4px'
									}}>
										<span style={{color: '#6c757d', fontSize: '10px'}}>No main</span>
									</div>
								)}

								{/* Additional Images */}
								{Array.isArray(store.AdditionalImages) && store.AdditionalImages.length > 0 && (
									<div style={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: '2px',
										justifyContent: 'center',
										maxWidth: '80px'
									}}>
										{store.AdditionalImages.slice(0, 3).map((image, index) => {
											// Handle both string URLs and object URLs
											const imageUrl = typeof image === 'string' ? image : image.url;
											const imageAlt = typeof image === 'object' && image.alt ? image.alt : `Additional Image ${index + 1}`;
											return (
												<img
													key={index}
													alt={`Additional ${index + 1}`}
													src={imageUrl}
													style={{
														width: '20px',
														height: '20px',
														objectFit: 'cover',
														borderRadius: '2px',
														border: '1px solid #dee2e6',
														cursor: 'pointer'
													}}
													title="Click to view full size"
													onClick={() => openImageModal(imageUrl, imageAlt)}
													onError={(e) => {
														e.target.style.display = 'none';
													}}
												/>
											);
										})}
										{store.AdditionalImages.length > 3 && (
											<div style={{
												width: '20px',
												height: '20px',
												backgroundColor: '#e9ecef',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'center',
												borderRadius: '2px',
												border: '1px solid #dee2e6',
												fontSize: '8px',
												color: '#495057'
											}}>
												+{store.AdditionalImages.length - 3}
											</div>
										)}
									</div>
								)}
							</div>
						),
						...cleanStore
					};
				});
				setStores(storesWithImages);
			} else {
				console.warn('API returned unexpected data format for stores:', response?.data);
				setStores([]);
			}
		} catch (error) {
			console.error('Error fetching stores:', error);
			setStores([]);
		}
	}

	useEffect(() => {
		getStores();
	}, []);

	return (
		<Fragment>
			<Breadcrumb title="Store List" parent="Stores" />
			<Container fluid={true}>
				<Card>
					<CardHeader>
						<h5>Lista magazine</h5>
					</CardHeader>
					<CardBody>
						<div className="btn-popup pull-right">
							<Link to="/stores/create-store" className="btn btn-secondary">
								Creează magazin
							</Link>
						</div>
						<div className="clearfix"></div>
						<div
							id="batchDelete"
							className="category-table store-list order-table coupon-list-delete"
						>
							{Array.isArray(stores) && stores.length > 0 ? (
								<Datatable
									multiSelectOption={false}
									myData={stores}
									pageSize={10}
									pagination={true}
									objectType={'store'}
									class="-striped -highlight"
									onDataChange={handleDataChange}
									onRefresh={getStores}
								/>
							) : (
								<div className="text-center p-4">
									{stores === null ? "Se încarcă datele..." : "Nu există magazine disponibile."}
								</div>
							)}
						</div>
					</CardBody>
				</Card>
			</Container>

			{/* Image Modal */}
			<Modal isOpen={imageModal.isOpen} toggle={closeImageModal} size="lg" centered>
				<ModalHeader toggle={closeImageModal}>
					{imageModal.alt}
				</ModalHeader>
				<ModalBody className="text-center">
					<img
						src={imageModal.imageUrl}
						alt={imageModal.alt}
						style={{
							maxWidth: '100%',
							maxHeight: '70vh',
							objectFit: 'contain',
							borderRadius: '8px',
							boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
						}}
						onError={(e) => {
							console.error('Failed to load modal image:', imageModal.imageUrl);
							closeImageModal();
						}}
					/>
				</ModalBody>
			</Modal>
		</Fragment>
	);
};

export default List_stores;
