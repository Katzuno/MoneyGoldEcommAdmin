import React, {Fragment, useEffect, useState} from "react";
import {Button, Card, CardBody, CardHeader, Col, Container, FormGroup, Input, Label, Row} from "reactstrap";
import Breadcrumb from "../common/breadcrumb";
import axios from "axios";
import {getApiConfig} from "../../helpers";
import MyDropzone from "../common/dropzone";
import MDEditor from "@uiw/react-md-editor";

const Create_media = () => {

    const [loadedMedia, setLoadedMedia] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const getMedia = async (id) => {
        const response = await axios.get(`${getApiConfig().baseUrl}/media/id/${id}`, {headers: getApiConfig().headers});
        if (response?.data) {
            console.log(response.data);
            setLoadedMedia(response.data);
        }

    }


    const handleSave = async () => {
        if (selectedFile) {
            const formData = new FormData();
            formData.append('file', selectedFile);

            try {
                const response = await axios.post(
                    `${getApiConfig().baseUrl}/media/${loadedMedia?.identifier}/upload`,
                    formData,
                    {
                        headers: {
                            ...getApiConfig().headers,
                            'Content-Type': 'multipart/form-data',
                        },
                    }
                );

                // Handle the response as needed
                console.log(response.data);
            } catch (error) {
                // Handle errors
                console.error('Error uploading file:', error);
            }
        }
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (id) {
            getMedia(id);
        }
    }, []);

    return (
        <Fragment>
            <Breadcrumb title="Editare imagine" parent="Media"/>
            <Container fluid={true}>
                <Card>
                    <CardHeader>
                        <h5>Info imagine</h5>
                    </CardHeader>
                    <CardBody>
                        <Row className="product-adding">
                            <Col xl="6">
                                <Card>
                                    <CardHeader>
                                        <h5>General</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="digital-add needs-validation">
                                            <FormGroup>
                                                <Label className="col-form-label pt-0">
                                                    <span>*</span> String identifier
                                                </Label>
                                                <Input
                                                    className="form-control"
                                                    id="validationCustom01"
                                                    type="text"
                                                    defaultValue={loadedMedia?.identifier}
                                                    readOnly={true}
                                                    disabled={true}
                                                />
                                            </FormGroup>

                                            <FormGroup>
                                                <Label className="col-form-label pt-0">
                                                    <span>*</span> File path
                                                </Label>
                                                <Input
                                                    className="form-control"
                                                    id="validationCustom01"
                                                    type="text"
                                                    defaultValue={loadedMedia?.filePath}
                                                    readOnly={true}
                                                    disabled={true}
                                                />
                                            </FormGroup>

                                            <Label className="col-form-label pt-0"> Modifica imaginea</Label>
											{loadedMedia?.identifier && <MyDropzone mediaFile={loadedMedia?.identifier}/>}

                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xl="6">
                                <Card>
                                    <CardHeader>
                                        <h5>General</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <div className="digital-add needs-validation">
                                            <Label className="col-form-label pt-0"> Imagine curenta </Label>
                                            <br/>
                                            <img
                                                src={`${getApiConfig().baseUrl}/${loadedMedia?.filePath.replace('uploads', '')}`}
                                                style={{maxWidth: '400px', maxHeight: '400px'}}/>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </Container>
        </Fragment>
    );
};

export default Create_media;
