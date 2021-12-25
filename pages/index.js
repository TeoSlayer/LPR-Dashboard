import Head from 'next/head'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import { Button, Card, Pagination } from 'react-bootstrap';
import {Col, Row, Container} from 'react-bootstrap';
import { Form } from 'react-bootstrap';


export async function getServerSideProps(context) {

  const apiUrl = 'http://localhost:3001/images';
  const images = await fetch(apiUrl)
    .then(response => response.json())
    .then(json => json.map(image => ({
      id: image.id,
      file: image.file,
      plate: image.plate,
      datetime: moment(image.datetime).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    })));



  return {
    props: {
      images: images,
    }
  }
}


export default function Home({ images }) {

  const [results, setResults] = useState(images);
  const [imagesOnPage, setImagesOnPage] = useState(images.slice(0, 10));

  //filter params and search params
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-');
  const [filterCounty, setFilterCounty] = useState('');
  const [filterMonth, setFilterMonth] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [filterYear, setFilterYear] = useState('');

  //modal
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState('');

  //pagination
  const [page, setPage] = useState(1);
  const [elementsOnPage, setElementsOnPage] = useState(10);
  const [totalElements, setTotalElements] = useState(images.length);
  const [totalPages, setTotalPages] = useState(Math.ceil(images.length / elementsOnPage));

  //Button Handlers
  const handleSearch = () => {
    const searchResults = images.filter(image => image.plate.toLowerCase().includes(search.toLowerCase()));
    setResults(searchResults);
    setPagination();
  }

  const handleSort = () => {
    if(sort === '-'){
      const sortResults = images
      alert("Nu ati selectat o metoda de sortare.");
      setResults(sortResults);
    }
    if(sort === 'asc'){
      const sortResults = images.sort((a, b) => (a.datetime > b.datetime) ? 1 : -1);
      setResults(sortResults);
    }
    if(sort === 'desc'){
      const sortResults = images.sort((a, b) => (a.datetime < b.datetime) ? 1 : -1);
      setResults(sortResults);
    }
    setPagination();
  }

  const handleFilterCounty = () => {
    if(filterCounty === 'None'){
      const filterResults = images;
      alert("Nu ati selectat judetul");
      setResults(filterResults);
    }
    if(filterCounty !=  'None'){
      const filterResults = images.filter(image => image.file.includes(filterCounty));
      setResults(filterResults);
    }
    setPagination();
  }

  const handleFilterMonth = () => {
    if(filterMonth === 'None'){
      const filterResults = images;
      alert("Nu ati selectat luna");
      setResults(filterResults);
    }
    if(filterMonth !=  'None'){
      const filterResults = results.filter(image => moment(image.datetime).format('MM') === filterMonth);
      setResults(filterResults);
    }
    setPagination();
  }

  const handleFilterDay = () => {
    if(filterDay === 'None'){
      const filterResults = images;
      alert("Nu ati selectat ziua");
      setResults(filterResults);
    }
    if(filterDay !=  'None'){
      const filterResults = results.filter(image => moment(image.datetime).format('DD') === filterDay);
      setResults(filterResults);
    } 
    setPagination();
  }


  const setPagination = () => {
    setPage(1);
    setTotalElements(results.length);
    setTotalPages(Math.ceil(results.length / elementsOnPage));
    handleImagesOnPage()
  }

  const handleImagesOnPage = () => {
    const start = (page - 1) * elementsOnPage;
    const end = start + elementsOnPage;
    const imagesOnPage = results.slice(start, end);
    setImagesOnPage(imagesOnPage);
  }

  const handlePage = (page) => {
    if(page <= totalPages || page > 0){
      setPage(page);
      handleImagesOnPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  const resetFiltersAndSearch = () => {
    setSearch('');
    setSort('-');
    setFilterCounty('None');
    setFilterMonth('None');
    setFilterDay('None');
    setPage(1);
    setTotalElements(images.length);
    setTotalPages(Math.ceil(images.length / elementsOnPage));
    setResults(images);
    handleImagesOnPage();
    console.log("reset filters and search");
    alert("Filtrele au fost resetate");
  }

  const handleModal = (image) => {
    setModalImage(image);
    setShowModal(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const closeModal = () => {
    setShowModal(false);
  }
  //make the ui prettier

  
  return (
    <>
      <Head>
        <title>LPR Dashboard</title>
        <link rel="manifest" href="manifest.json" />
        <meta name="mobile-web-app-capable" content="yes"/>
        <meta name="application-name" content="RuncuLPR"/>
        <meta name="apple-mobile-web-app-title" content="RuncuLPR"/>
        <meta name="theme-color" content="#0275d8"/>
        <meta name="msapplication-navbutton-color" content="#0275d8"/>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"/>
        <meta name="msapplication-starturl" content="/"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <link rel="apple-touch-icon" href="apple-icon-180.png"/>
        <meta name="apple-mobile-web-app-capable" content="yes"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2048-2732.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2732-2048.jpg" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1668-2388.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2388-1668.jpg" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1536-2048.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2048-1536.jpg" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1668-2224.jpg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2224-1668.jpg" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1620-2160.jpg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2160-1620.jpg" media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1284-2778.jpg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2778-1284.jpg" media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1170-2532.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2532-1170.jpg" media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1125-2436.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2436-1125.jpg" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1242-2688.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2688-1242.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-828-1792.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1792-828.jpg" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1242-2208.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-2208-1242.jpg" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-750-1334.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1334-750.jpg" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-640-1136.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"/>
        <link rel="apple-touch-startup-image" href="apple-splash-1136-640.jpg" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"/>

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container>
        <Row>
          <Col>
            <h1 className='content-align-center'>LPR Dashboard</h1>
          </Col>
        </Row>
        <Row style={{marginTop: '20px',marginBottom: '20px'}}>
          <Col>
            <Form inline>
              <Form.Control type="text" placeholder="Search" className="mr-sm-2" onChange={(e) => setSearch(e.target.value)}></Form.Control>
            </Form>
          </Col>
        </Row>
        <Row style={{marginBottom: '20px'}}>
          <Col>
            <Form inline>
              <Button variant="outline-primary" onClick={handleSearch} style={{marginInline: '5px'}}>Search</Button>
              <Button variant="outline-success" onClick={handleSort} style={{marginInline: '5px'}}>Sort</Button>
              <Button variant="outline-success" onClick={handleFilterCounty} style={{marginInline: '5px'}}>Filtru Judet</Button>
              <Button variant="outline-success" onClick={handleFilterMonth} style={{marginInline: '5px'}}>Filtru Luna</Button>
              <Button variant="outline-success" onClick={handleFilterDay} style={{marginInline: '5px'}}>Filtru Zi</Button>
              <Button variant="outline-danger" onClick={resetFiltersAndSearch} style={{marginInline: '5px'}}>Reset Filtre</Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Sort</Form.Label>
                <Form.Control as="select" onChange={(e) => setSort(e.target.value)}>
                  <option>-</option>
                  <option>asc</option>
                  <option>desc</option>
                </Form.Control>
              </Form.Group> 
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Filter County</Form.Label>
                <Form.Control as="select" onChange={(e) => setFilterCounty(e.target.value)}>
                  <option>None</option>
                  <option>AB</option>
                  <option>AR</option>
                  <option>AG</option>
                  <option>BC</option>
                  <option>BH</option>
                  <option>BN</option>
                  <option>BT</option>
                  <option>BV</option>
                  <option>BR</option>
                  <option>BZ</option>
                  <option>CS</option>
                  <option>CL</option>
                  <option>CJ</option>
                  <option>CT</option>
                  <option>CV</option>
                  <option>DB</option>
                  <option>DJ</option>
                  <option>GL</option>
                  <option>GR</option>
                  <option>GJ</option>
                  <option>HR</option>
                  <option>HD</option>
                  <option>IL</option>
                  <option>IS</option>
                  <option>IF</option>
                  <option>MM</option>
                  <option>MH</option>
                  <option>MS</option>
                  <option>NT</option>
                  <option>OT</option>
                  <option>PH</option>
                  <option>SM</option>
                  <option>SJ</option>
                  <option>SB</option>
                  <option>SV</option>
                  <option>TR</option>
                  <option>TM</option>
                  <option>TL</option>
                  <option>VS</option>
                  <option>VL</option>
                  <option>VN</option>
                  <option>B</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Filter Month</Form.Label>
                <Form.Control as="select" onChange={(e) => setFilterMonth(e.target.value)}>
                  <option>None</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Filter Day</Form.Label>
                <Form.Control as="select" onChange={(e) => setFilterDay(e.target.value)}>
                  <option>None</option>
                  <option>01</option>
                  <option>02</option>
                  <option>03</option>
                  <option>04</option>
                  <option>05</option>
                  <option>06</option>
                  <option>07</option>
                  <option>08</option>
                  <option>09</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                  <option>14</option>
                  <option>15</option>
                  <option>16</option>
                  <option>17</option>
                  <option>18</option>
                  <option>19</option>
                  <option>20</option>
                  <option>21</option>
                  <option>22</option>
                  <option>23</option>
                  <option>24</option>
                  <option>25</option>
                  <option>26</option>
                  <option>27</option>
                  <option>28</option>
                  <option>29</option>
                  <option>30</option>
                  <option>31</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
        </Row>
        <Row style={{marginTop: '20px'}}>
          <Col>
            {imagesOnPage.map((image, index) => {
              return (
                <Card style={{marginTop: '20px'}}>
                  <Card.Img variant="top" src={image.file} />
                  <Card.Body>
                    <Card.Title>{image.plate}</Card.Title>
                    <Card.Text>
                      {moment(image.datetime).format('MMMM Do YYYY, h:mm:ss')}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer>
                    <Button variant="primary" onClick={() => handleModal(image)}>View</Button>
                  </Card.Footer>
                </Card>
              )
            }
            )}
          </Col>
        </Row>
        <Row style={{marginTop:'30px'}}>
          <Col>
            <Pagination>
              <Pagination.First onClick={() => handlePage(1)}/>
              <Pagination.Prev onClick={() => handlePage(page - 1)}/>
              {() => {for(let i = 1; i <= totalPages; i++){
                return (
                  <>
                     <Pagination.Item onClick={() => handlePage(i)}>{i}</Pagination.Item>
                  </>
                );
              }}}
              <Pagination.Next onClick={() => handlePage(page + 1)}/>
              <Pagination.Last onClick={() => handlePage(totalPages)}/>
            </Pagination>
          </Col>
        </Row>
        {showModal && (
          <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
              <Modal.Title>{modalImage.plate}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <img src={modalImage.file} alt="" width="80%" />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
      </>
  
  )
}





