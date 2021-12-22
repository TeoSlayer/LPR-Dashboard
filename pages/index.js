import Head from 'next/head'
import Image from 'next/image'
import fs from 'fs';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
export function getServerSideProps(context) {
  //we have a folder where we have a series of images
  //these images have a name in the following format: "TR04FEN_20211212114111243_PLATE.jpg" or "TR04FEN_20211212114111243_BACKGROUND.jpg"
  //We want to get a list of all these images in a workable format and the list has to also contain the data from the name properly formatted
  //In the example above "TR04FEN" is the number plate and "20211212114111243" is the timestamp, the timestamp is the same for both images
  //We want to get a list of all these images in a workable format and the list has to also contain the data from the name properly formatted
  //In the example above "TR04FEN" is the number plate and "20211212114111243" is the timestamp, the timestamp is the same for both images
  //We want to get a list of all these images in a workable format and the list has to also contain the data from the name properly formatted

  //come on please stop messing around


  //stop

  //the timestamp is in the following format, it has to be converted to date object for sorting by time purposes using moment.js
  //"20211212114111243" is "YYYYMMDDHHMMSS", the last 3 digits being random numbers
  const files = fs.readdirSync('./public/images/');
  const images = files.map(file => {
    const [plate, timestamp, type] = file.split('_');
    const day = moment(timestamp.substring(0, 8), 'YYYYMMDD');
    const time = moment(timestamp.substring(8), 'HHmmss');
    //merge date and time
    const date = moment(day).set({ 
      hour: time.hour(),
      minute: time.minute(),
      second: time.second()
    }).toObject();
    //return the image.url
    return {
      plate,
      timestamp,
      date,
      url: `/images/${file}`
    }
    });
  return {
    props: {
      images
    }
  }
  //I get this error: Error: Error serializing `.images[0].date` returned from `getServerSideProps` in "/".
  //Reason: `object` ("[object Date]") cannot be serialized as JSON. Please only return JSON serializable data types.
  //Solution: return a date object in the following format: new Date(year, month, day, hours, minutes, seconds, milliseconds)
}

export default function Home({ images }) {
  //usestate for search
  const [search, setSearch] = useState('');
  //usestate for sorting
  const [sort, setSort] = useState('date');
  //usestate for sorting direction
  const [sortDir, setSortDir] = useState('desc');
  //usestate for pagination
  const [page, setPage] = useState(1);
  //usestate for pagination size
  const [pageSize, setPageSize] = useState(10);
  //usestate for pagination size
  const [total, setTotal] = useState(images.length);
  //usestate for pagination size
  const [pageCount, setPageCount] = useState(Math.ceil(images.length / pageSize));
  //usestate for pagination size
  const [pageImages, setPageImages] = useState(images.slice(0, pageSize));

  const [selectedImage, setSelectedImage] = useState(null);

  const [showModal, setShowModal] = useState(false);

  //modal
  const handleClose = () => {
    setShowModal(false);
  };

  //modal doesn t work



  //modal useeffect
  useEffect(() => {
    if (selectedImage) {
      setShowModal(true);
    }
  }, [selectedImage]);

  //useeffect for search
  useEffect(() => {
    const filtered = images.filter(image => image.plate.toLowerCase().includes(search.toLowerCase()));
    setPageImages(filtered.slice(0, pageSize));
    setTotal(filtered.length);
    setPageCount(Math.ceil(filtered.length / pageSize));
  }, [search, pageSize, images]);

  //useeffect for sorting
  useEffect(() => {
    const sorted = images.sort((a, b) => {
      if (sort === 'date') {
        return sortDir === 'asc' ? a.date - b.date : b.date - a.date;
      } else if (sort === 'plate') {
        return sortDir === 'asc' ? a.plate.localeCompare(b.plate) : b.plate.localeCompare(a.plate);
      }
    });
    setPageImages(sorted.slice(0, pageSize));
  }, [sort, sortDir, pageSize, images]);

  //useeffect for pagination
  useEffect(() => {
    setPageImages(images.slice((page - 1) * pageSize, page * pageSize));
    if (pageSize > total) {
      setPageSize(total);
    }
    if (page > pageCount) {
      setPage(pageCount);
    }
    
  }, [page, pageSize, images]);

  //catch error for page size
  
  //RangeError: Array size is not a small enough positive integer. on pagesize
  //Solution: set pageSize to total if pageSize is greater than total

  //return the page
  //catch error if pagination is out of bounds

  //setSelectedImage is not yet set
  //Solution: setSelectedImage is not yet set



 

  return (
    <>
  <section className="content">
        <div className="container-fluid">
            <div className="col-sm-6">
              <h1 className="m-0 text-dark">Runcu LPR Dashboard</h1>
            </div>
            <div className="col-sm-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="card card-primary">
                    <div className="card-header">
                      <h3 className="card-title">Search</h3>
                    </div>
                    <div className="card-body">
                      <div className="form-group">
                        <label htmlFor="search">Search</label>
                        <input type="text" className="form-control" id="search" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <small className="form-text text-muted">Search for a specific number plate or timestamp</small>
                        <div className="form-group">
                          <label htmlFor="sort">Sort</label>
                          <select className="form-control" id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                            <option value="date">Date</option>
                            <option value="plate">Plate</option>
                          </select>
                          <small className="form-text text-muted">Sort by date or by plate</small>
                          <div className="form-group">
                            <label htmlFor="sortDir">Sort Direction</label>
                            <select className="form-control" id="sortDir" value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
                              <option value="asc">Ascending</option>
                              <option value="desc">Descending</option>
                            </select>
                            <small className="form-text text-muted">Sort ascending or descending</small>
                            <label htmlFor="page">Page</label>
                                <select className="form-control" id="page" value={page} onChange={(e) => setPage(e.target.value)}>
                                  {[...Array(pageCount).keys()].map(i => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                                </select>
                            <small className="form-text text-muted">Set the page</small>
                            <div className="form-group">
                              <div className="form-group">
                                
                                <div className="form-group">
                                  <button className="btn btn-primary" onClick={() => {
                                    const filteredImages = images.filter(image => image.plate.toLowerCase().includes(search.toLowerCase()) || image.timestamp.toLowerCase().includes(search.toLowerCase()));
                                    const sortedImages = sortDir === 'asc' ? filteredImages.sort((a, b) => a[sort] > b[sort] ? 1 : -1) : filteredImages.sort((a, b) => a[sort] < b[sort] ? 1 : -1);
                                    const pageImages = sortedImages.slice((page - 1) * pageSize, page * pageSize);
                                    setPageImages(pageImages);
                                    setTotal(sortedImages.length);
                                    setPageCount(Math.ceil(sortedImages.length / pageSize));
                                  }}>Search</button>
                                </div>
                                <div className="form-group">
                                  <button className="btn btn-primary" onClick={() => {
                                    setSearch('');
                                    setSort('date');
                                    setSortDir('desc');
                                    setPage(1);
                                    setPageSize(10);
                                    setPageImages(images.slice(0, pageSize));
                                    setTotal(images.length);
                                    setPageCount(Math.ceil(images.length / pageSize));
                                  }}>Reset</button>
                                </div>
                                <div className="form-group">
                                  <button className="btn btn-primary" onClick={() => {
                                    const sortedImages = sortDir === 'asc' ? images.sort((a, b) => a[sort] > b[sort] ? 1 : -1) : images.sort((a, b) => a[sort] < b[sort] ? 1 : -1);
                                    const pageImages = sortedImages.slice((page - 1) * pageSize, page * pageSize);
                                    setPageImages(pageImages);
                                    setTotal(sortedImages.length);
                                    setPageCount(Math.ceil(sortedImages.length / pageSize));
                                  }}>Sort</button>
                                </div>
                                <div className="form-group">
                                  <button className="btn btn-primary" onClick={() => {
                                    const sortedImages = sortDir === 'asc' ? images.sort((a, b) => a[sort] > b[sort] ? 1 : -1) : images.sort((a, b) => a[sort] < b[sort] ? 1 : -1);
                                    const pageImages = sortedImages.slice((page - 1) * pageSize, page * pageSize);
                                    const pageCount = Math.ceil(sortedImages.length / pageSize);
                                    const page = pageCount > 0 ? pageCount : 1;
                                    const pageSize = pageCount > 0 ? sortedImages.length : images.length;
                                    const total = sortedImages.length;
                                    setPageImages(pageImages);
                                    setTotal(total);
                                    setPageCount(pageCount);
                                    setPage(page);
                                    setPageSize(pageSize);
                                  }}>Sort and Paginate</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card"> 
                        <div className="card-header">
                          <h5>Results</h5>
                          <h6>{total} results</h6>
                          <h6>{pageCount} pages</h6>
                          <h6>{page} page</h6>
                          <h6>{pageSize} results per page</h6>
                          <h6>{pageImages.length} results on this page</h6>
                          <h6>{pageImages.length === 0 ? 'No results' : ''}</h6>
                          <h6>{pageImages.length === 1 ? '1 result' : ''}</h6>
                          <h6>{pageImages.length > 1 ? `${pageImages.length} results` : ''}</h6>
                        </div>
                        <div className="card-body">
                          <div className="row">
                            {pageImages.map(image => (
                              <div className="col-sm-6 col-md-4 col-lg-3" key={image.id}>
                                <div className="card">
                                  <img className="card-img-top" src={image.url} alt="" />
                                  <div className="card-body">
                                    <h5 className="card-title">{image.plate}</h5>
                                    <p className="card-text">{moment(image.date).format("DD MMM, YYYY - HH:MM:SS")}</p>
                                    <button className="btn btn-primary" onClick={() => {
                                      setSelectedImage(image);
                                      setShowModal(true);
                    

                                    }}>View</button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                         </div>     
                      </div>
                      <div className="card-footer">
                            <div className="row">
                              <div className="col-sm-6 col-md-4 col-lg-3">
                                <button className="btn btn-primary" onClick={() => {
                                  setPage(1);
                                  setPageImages(images.slice(0, pageSize));
                                }}>First</button>
                                <button className="btn btn-primary" onClick={() => {
                                  setPage(page - 1);
                                  setPageImages(images.slice((page - 1) * pageSize, page * pageSize));
                                }}>Previous</button>
                                <button className="btn btn-primary" onClick={() => {
                                  setPage(page + 1);
                                  setPageImages(images.slice((page - 1) * pageSize, page * pageSize));
                                }}>Next</button>
                                <button className="btn btn-primary" onClick={() => {
                                  setPage(pageCount);
                                  setPageImages(images.slice((page - 1) * pageSize, page * pageSize));
                                }}>Last</button>
                              </div>
                            </div>
                          </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </section>

      {showModal && (
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedImage.plate}</Modal.Title>
        </Modal.Header> 
        <Modal.Body >
          <img src={selectedImage.url} alt="" width="70%"/>
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" onClick={() => setShowModal(false)}>Close</button>
        </Modal.Footer> 
      </Modal>
      )}
      </>
    
  );
}
