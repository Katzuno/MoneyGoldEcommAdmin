import React, {Fragment, useEffect, useState} from "react";
import Breadcrumb from "./common/breadcrumb";
import {
    Navigation,
    Box,
    MessageSquare,
    Users,
    Briefcase,
    CreditCard,
    ShoppingCart,
    Calendar,
} from "react-feather";
import CountUp from "react-countup";
import {Chart} from "react-google-charts";

import {Bar, Line} from "react-chartjs-2";
import {
    lineOptions,
    buyOption,
    employeeData,
    employeeOptions,
} from "../constants/chartData";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    BarElement,
    ArcElement,
    Filler,
    RadialLinearScale
} from 'chart.js';


// image impoer
import user2 from "../assets/images/dashboard/user2.jpg";
import user1 from "../assets/images/dashboard/user1.jpg";
import man from "../assets/images/dashboard/man.png";
import user from "../assets/images/dashboard/user.png";
import designer from "../assets/images/dashboard/designer.jpg";
import {
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    Media,
    Row,
    Table,
} from "reactstrap";
import {getApiConfig} from "../helpers";
import axios from "axios";
import Datatable from "./common/datatable";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    BarElement,
    ArcElement,
    Filler,
    RadialLinearScale
);

const Dashboard = () => {
    const buyData = {
        labels: ["", "10", "20", "30", "40", "50"],
        datasets: [
            {
                backgroundColor: "transparent",
                borderColor: "#13c9ca",
                data: [20, 5, 80, 10, 100, 15],
                lineTension: 0.4,
            },
            {
                backgroundColor: "transparent",
                borderColor: "#a5a5a5",
                data: [0, 50, 20, 70, 30, 27],
                lineTension: 0.4,
            },
            {
                backgroundColor: "transparent",
                borderColor: "#a88952",
                data: [0, 30, 40, 10, 86, 40],
                lineTension: 0.4,
            },
        ],
    };

    const doughnutOptions = {
        title: "",
        pieHole: 0.35,
        pieSliceBorderColor: "none",
        colors: ["#a88952", "#13c9ca", "#a5a5a5"],
        legend: {
            position: "none",
        },
        pieSliceText: "none",
        tooltip: {
            trigger: "none",
        },
        animation: {
            startup: true,
            easing: "linear",
            duration: 1500,
        },
        chartArea: {left: 0, top: 10, width: "360px", height: "100%"},
        enableInteractivity: false,
    };
    const pieOptions = {
        title: "",
        pieHole: 1,
        slices: [
            {
                color: "#a88952",
            },
            {
                color: "#13c9ca",
            },
            {
                color: "#f0b54d",
            },
        ],
        tooltip: {
            showColorCode: false,
        },
        chartArea: {left: 0, top: 10, width: "360px", height: "100%"},
        legend: "none",
    };
    const LineOptions = {
        hAxis: {
            textPosition: "none",
            baselineColor: "transparent",
            gridlineColor: "transparent",
        },
        vAxis: {
            textPosition: "none",
            baselineColor: "transparent",
            gridlineColor: "transparent",
        },
        colors: ["#a88952"],
        legend: "none",
    };
    const LineOptions1 = {
        hAxis: {
            textPosition: "none",
            baselineColor: "transparent",
            gridlineColor: "transparent",
        },
        vAxis: {
            textPosition: "none",
            baselineColor: "transparent",
            gridlineColor: "transparent",
        },
        colors: ["#13c9ca"],
        chartArea: {left: 0, top: 0, width: "100%", height: "100%"},
        legend: "none",
    };
    const LineOptions2 = {
        hAxis: {
            textPosition: "none",
            baselineColor: "transparent",
            gridlineColor: "transparent",
        },
        vAxis: {
            textPosition: "none",
            baselineColor: "transparent",
            gridlineColor: "transparent",
        },
        colors: ["#f5ce8a"],
        chartArea: {left: 0, top: 0, width: "100%", height: "100%"},
        legend: "none",
    };
    const LineOptions3 = {
        hAxis: {
            textPosition: "none",
            baselineColor: "transparent",
            gridlineColor: "transparent",
        },
        vAxis: {
            textPosition: "none",
            baselineColor: "transparent",
            gridlineColor: "transparent",
        },
        colors: ["#a5a5a5"],
        chartArea: {left: 0, top: 0, width: "100%", height: "100%"},
        legend: "none",
    };

    const [newUsers, setNewUsers] = useState(0);
    const [newOrders, setNewOrders] = useState(0);
    const [newOrdersAvgValue, setNewOrdersAvgValue] = useState(0);
    const [earnings, setEarnings] = useState(0);
    const [pendingOrders, setPendingOrders] = useState(0);
    const [mostSoldProducts, setMostSoldProducts] = useState([]);
    const [mostSoldPromotions, setMostSoldPromotions] = useState([]);
    const [mostOrdersByCity, setMostOrdersByCity] = useState([]);

    const [mostSoldProductsGraphData, setMostSoldProductsGraphData] = useState(
        {
            labels: [],
            datasets: [],
        });
    const [mostUsedPromotionsGraphData, setMostUsedPromotionsGraphData] = useState(
        {
            labels: [],
            datasets: [],
        });

    const [mostOrdersByCityGraphData, setMostOrdersByCityGraphData] = useState(null);

    const getUsersLastMonth = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/reports/usersLastMonth`, {headers: getApiConfig().headers});
        if (response?.data) {
            setNewUsers(response.data);
        }
    }

    const getOrdersLastMonth = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/reports/totalSales`, {headers: getApiConfig().headers});
        if (response?.data) {
            setNewOrders(response.data['totalOrders']);
            setNewOrdersAvgValue(response.data['avgOrderValue']);
            setEarnings(response.data['totalSales']);
        }
    }

    const getPendingOrders = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/reports/pendingOrders`, {headers: getApiConfig().headers});
        if (response?.data) {
            setPendingOrders(response.data);
        }
    }

    const getMostSoldProducts = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/reports/mostSoldProducts`, {headers: getApiConfig().headers});
        if (response?.data) {
            setMostSoldProducts(response.data);
        }
    }

    const getMostSoldPromotions = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/reports/topPerformingPromotions`, {headers: getApiConfig().headers});
        if (response?.data) {
            setMostSoldPromotions(response.data);
        }
    }

    const getMostOrdersByCity = async () => {
        const response = await axios.get(`${getApiConfig().baseUrl}/reports/citiesWithMostOrders`, {headers: getApiConfig().headers});
        if (response?.data) {
            setMostOrdersByCity(response.data);
        }
    }

    useEffect(() => {
        getUsersLastMonth();
        getOrdersLastMonth();
        getPendingOrders();
        getMostSoldProducts();
        getMostSoldPromotions();
        getMostOrdersByCity();
    }, []);

    useEffect(() => {
        setMostSoldProductsGraphData({
            /**
             * Keep just the first 5 words from the product name
             */
            labels:
                mostSoldProducts.map(product => product.productName.split(' ').slice(0, 5).join(' ') + '...')
            ,
            datasets: [
                {
                    data: mostSoldProducts.map(product => parseFloat(product.totalRevenue)),
                    borderColor: "#a88952",
                    backgroundColor: "#a88952",
                    borderWidth: 2,
                    barPercentage: 0.7,
                    categoryPercentage: 0.4,
                },
            ],
        })
    }, [mostSoldProducts]);


    useEffect(() => {
        setMostUsedPromotionsGraphData({
            /**
             * Keep just the first 5 words from the product name
             */
            labels: mostSoldPromotions.map(promotion => promotion.promotionName),
            datasets: [
                {
                    data: mostSoldPromotions.map(promotion => parseFloat(promotion.totalOrders)),
                    borderColor: "#a5a5a5",
                    backgroundColor: "#a5a5a5",
                    borderWidth: 2,
                    barPercentage: 0.7,
                    categoryPercentage: 0.4,
                },
            ],
        })
    }, [mostSoldPromotions]);


    useEffect(() => {
        setMostOrdersByCityGraphData([
            ["Oras", "Numar de comenzi"],
            ...mostOrdersByCity.map(city => [city.cityName, parseInt(city.totalOrders)])
        ]);
    }, [mostOrdersByCity]);


    return (
        <Fragment>
            <Breadcrumb title="Dashboard" parent="Dashboard"/>
            <Container fluid={true}>
                <Row>
                    <Col xl="3 xl-50" md="6">
                        <Card className=" o-hidden widget-cards">
                            <CardBody className="bg-warning">
                                <Media className="static-top-widget row">
                                    <div className="icons-widgets col-4">
                                        <div className="align-self-center text-center">
                                            <Navigation className="font-warning"/>
                                        </div>
                                    </div>
                                    <Media body className="col-8">
                                        <span className="m-0">Vanzari</span>
                                        <h3 className="mb-0">
                                            RON <CountUp className="counter" end={earnings}/>
                                            <small> Ultima luna</small>
                                        </h3>
                                    </Media>
                                </Media>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="3 xl-50" md="6">
                        <Card className=" o-hidden  widget-cards">
                            <CardBody className="bg-secondary ">
                                <Media className="static-top-widget row">
                                    <div className="icons-widgets col-4">
                                        <div className="align-self-center text-center">
                                            <Box className="font-secondary"/>
                                        </div>
                                    </div>
                                    <Media body className="col-8">
                                        <span className="m-0">Comenzi in asteptare</span>
                                        <h3 className="mb-0">
                                            <CountUp className="counter" end={pendingOrders?.total}/>
                                        </h3>
                                    </Media>
                                </Media>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="3 xl-50" md="6">
                        <Card className="o-hidden widget-cards">
                            <CardBody className="bg-primary">
                                <Media className="static-top-widget row">
                                    <div className="icons-widgets col-4">
                                        <div className="align-self-center text-center">
                                            <MessageSquare className="font-primary"/>
                                        </div>
                                    </div>
                                    <Media body className="col-8">
                                        <span className="m-0">Numar comenzi</span>
                                        <h3 className="mb-0">
                                            <CountUp className="counter" end={newOrders}/>
                                            <small> Ultima luna</small>
                                        </h3>
                                    </Media>
                                </Media>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="3 xl-50" md="6">
                        <Card className=" o-hidden widget-cards">
                            <CardBody className="bg-danger ">
                                <Media className="static-top-widget row">
                                    <div className="icons-widgets col-4">
                                        <div className="align-self-center text-center">
                                            <Users className="font-danger"/>
                                        </div>
                                    </div>
                                    <Media body className="col-8">
                                        <span className="m-0">Utilizatori noi</span>
                                        <h3 className="mb-0">
                                            <CountUp className="counter" end={newUsers}/>
                                            <small> Ultima luna</small>
                                        </h3>
                                    </Media>
                                </Media>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="6 xl-100">
                        <Card>
                            <CardHeader>
                                <h5>Cele mai vandute produse (ultima luna)</h5>
                            </CardHeader>
                            <CardBody>
                                <div className="market-chart">
                                    {mostSoldProductsGraphData?.labels?.length > 0 &&
                                        <Bar
                                            data={mostSoldProductsGraphData}
                                            options={lineOptions}
                                            width={778}
                                            height={308}
                                        />
                                    }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xl="6 xl-100">
                        <Card>
                            <CardHeader>
                                <h5>Comenzi in asteptare</h5>
                            </CardHeader>
                            <CardBody>
                                <div className="user-status table-responsive latest-order-table">
                                    {pendingOrders?.orders?.length > 0 && <Datatable
                                        multiSelectOption={false}
                                        myData={pendingOrders?.orders}
                                        pageSize={10}
                                        pagination={true}
                                        objectType={'order'}
                                        class="-striped -highlight"
                                    />}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    {/*<Col xl="3 xl-50" md="6">*/}
                    {/*//     <Card className=" order-graph sales-carousel">*/}
                    {/*//         <CardHeader>*/}
                    {/*//             <h6>Total vanzari</h6>*/}
                    {/*//             <Row>*/}
                    {/*                <Col className="col-6">*/}
                    {/*                    <div className="small-chartjs">*/}
                    {/*                        <div*/}
                    {/*                            className="flot-chart-placeholder"*/}
                    {/*                            id="simple-line-chart-sparkline-3"*/}
                    {/*                        >*/}
                    {/*                            <Chart*/}
                    {/*                                height={"60px"}*/}
                    {/*                                chartType="LineChart"*/}
                    {/*                                loader={<div>Loading Chart</div>}*/}
                    {/*                                data={[*/}
                    {/*                                    ["x", "time"],*/}
                    {/*                                    [0, 20],*/}
                    {/*                                    [1, 5],*/}
                    {/*                                    [2, 120],*/}
                    {/*                                    [3, 10],*/}
                    {/*                                    [4, 140],*/}
                    {/*                                    [5, 15],*/}
                    {/*                                ]}*/}
                    {/*                                options={LineOptions}*/}
                    {/*                                legend_toggle*/}
                    {/*                            />*/}
                    {/*                        </div>*/}
                    {/*                    </div>*/}
                    {/*                </Col>*/}
                    {/*                <Col className="col-6">*/}
                    {/*                    <div className="value-graph">*/}
                    {/*                        <h3>*/}
                    {/*                            42%{" "}*/}
                    {/*                            <span>*/}
                    {/*								<i className="fa fa-angle-up font-primary"></i>*/}
                    {/*							</span>*/}
                    {/*                        </h3>*/}
                    {/*                    </div>*/}
                    {/*                </Col>*/}
                    {/*            </Row>*/}
                    {/*        </CardHeader>*/}
                    {/*        <CardBody>*/}
                    {/*            <Media>*/}
                    {/*                <Media body>*/}
                    {/*                    <span>Comenzi in ultima luna</span>*/}
                    {/*                    <h2 className="mb-0">{newOrders}</h2>*/}
                    {/*                    <p>*/}
                    {/*                        0.25%{" "}*/}
                    {/*                        <span>*/}
                    {/*							<i className="fa fa-angle-up"></i>*/}
                    {/*						</span>*/}
                    {/*//                     </p>*/}
                    {/*                </Media>*/}
                    {/*<div className="bg-primary b-r-8">*/}
                    {/*                    <div className="small-box">*/}
                    {/*                        <Briefcase/>*/}
                    {/*                    </div>*/}
                    {/*                </div>*/}
                    {/*            </Media>*/}
                    {/*        </CardBody>*/}
                    {/*    </Card>*/}
                    {/*</Col>*/}
                    <Col xl="6 xl-100">
                        <Card>
                            <CardHeader>
                                <h5>Cele mai folosite promotii (ultima luna)</h5>
                            </CardHeader>
                            <CardBody>
                                <div className="market-chart">
                                    {mostUsedPromotionsGraphData?.labels?.length > 0 &&
                                        <Bar
                                            data={mostUsedPromotionsGraphData}
                                            options={lineOptions}
                                            width={778}
                                            height={308}
                                        />
                                    }
                                </div>
                            </CardBody>
                        </Card>
                    </Col>

                    <Col sm="6">
                        <Card>
                            <CardHeader>
                                <h5>Locatie comenzi</h5>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xl="3 xl-50" sm="6">
                                        <div className="order-graph">
                                            <h6>Comenzi dupa oras</h6>
                                            <div className="chart-block chart-vertical-center">
                                                {mostOrdersByCityGraphData &&
                                                    <Chart
                                                        chartType="PieChart"
                                                        data={mostOrdersByCityGraphData}
                                                        options={pieOptions}
                                                        graph_id="PieChart"
                                                        width={"100%"}
                                                        height={"180px"}
                                                        legend_toggle
                                                    />
                                                }
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </Fragment>
    );
};

// javascript:void(0)

export default Dashboard;
