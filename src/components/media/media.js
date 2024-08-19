import React, {Fragment, useEffect, useState} from "react";
import Breadcrumb from "../common/breadcrumb";
import MyDropzone from "../common/dropzone";
import Datatable from "../common/datatable";
import data from "../../assets/data/media";
import {Card, CardBody, CardHeader, Container} from "reactstrap";
import axios from "axios";
import {getApiConfig} from "../../helpers";

const Media = () => {
        const [media, setMedia] = useState([]);

        const getMedia = async () => {
            const response = await axios.get(`${getApiConfig().baseUrl}/media/all`, {headers: getApiConfig().headers});
            if (response?.data) {
                for (let index in response.data.media) {
                    response.data.media[index] =
                        {
                            image: <img alt=""
                                        src={`${getApiConfig().baseUrl}/${response.data.media[index]['filePath'].replace('uploads', '')}`}
                                        style={{width: 100, height: 100}}/>,
                            ...response.data.media[index]
                        }
                        delete response.data.media[index]['createdAt'];
                        delete response.data.media[index]['updatedAt'];
                }
                setMedia(response.data?.media);
            }
        }

        useEffect(() => {
            getMedia();
        }, []);


        return (
            <Fragment>
                <Breadcrumb title="Media" parent="Media"/>
                <Container fluid={true}>
                    {/*<Card>*/}
                    {/*	<CardHeader>*/}
                    {/*		<h5>Dropzone Media</h5>*/}
                    {/*	</CardHeader>*/}
                    {/*	<CardBody>*/}
                    {/*		<MyDropzone />*/}
                    {/*	</CardBody>*/}
                    {/*</Card>*/}
                    <Card>
                        <CardHeader>
                            <h5>Media File List</h5>
                        </CardHeader>
                        <CardBody>
                            <div
                                id="batchDelete"
                                className="category-table media-table coupon-list-delete"
                            >
                                {media.length > 0 && <Datatable
                                    multiSelectOption={false}
                                    myData={media}
                                    pageSize={100}
                                    pagination={false}
									objectType={'media'}
                                    class="-striped -highlight"
                                />
                                }
                            </div>
                        </CardBody>
                    </Card>
                </Container>
            </Fragment>
        );
    }
;

export default Media;
