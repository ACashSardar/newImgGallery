import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { saveAs } from "file-saver";

function App() {
  const [query, setQuery] = useState("nature");
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(7);
  const [selected, setSelected] = useState("");
  const [showVideos, setShowVideos] = useState(false);

  const getImages = async () => {
    await axios
      .get(
        `https://api.pexels.com/v1/search?query=${query}&orientation=landscape&size=medium`,
        {
          headers: {
            Authorization: `jUeC6EnmP3bSLZVPFuLzitXzS0kH0aT46zTSrrxT4bSKcG41TDJ4mMMG`,
          },
        }
      )
      .then((res) => {
        setLoading(false);
        return setImages(res.data.photos);
      });
  };

  const getVideos = async () => {
    await axios
      .get(`https://api.pexels.com/videos/search?query=${query}`, {
        headers: {
          Authorization: `jUeC6EnmP3bSLZVPFuLzitXzS0kH0aT46zTSrrxT4bSKcG41TDJ4mMMG`,
        },
      })
      .then((res) => {
        setLoading(false);
        console.log(res.data.videos);
        return setVideos(res.data.videos);
      });
  };

  const handleSearch = () => {
    setLoading(true);
    getVideos();
    getImages();
  };

  const handlePrev = () => {
    if (low < 8) return;
    setLow((e) => e - 8);
    setHigh((e) => e - 8);
  };

  const handleNext = () => {
    if (high >= images.length) return;
    setLow((e) => e + 8);
    setHigh((e) => e + 8);
  };

  const toggleContent = () => {
    setShowVideos((e) => !e);
  };

  function download(url, name) {
    saveAs(url, name);
  }

  useEffect(() => {
    getVideos();
    getImages();
  }, []);

  return (
    <div className="App">
      <nav
        className="row p-2 mb-5 border-bottom bg-light fixed-top"
        style={{ background: "white" }}
      >
        <div className="col-md-7 d-flex justify-content-between">
          <img
            src="https://asset.brandfetch.io/idUIh6k_cy/idQgJhGfSi.png"
            style={{ height: "40px" }}
          />
          {showVideos ? (
            <span>
              <button
                className="btn btn-light rounded-0 px-4 py-2"
                onClick={() => toggleContent()}
              >
                Images
              </button>
              <button className="btn btn-dark rounded-0 px-4 py-2">
                Videos
              </button>
            </span>
          ) : (
            <span>
              <button className="btn btn-dark rounded-0 px-4 py-2">
                Images
              </button>
              <button
                className="btn btn-light rounded-0 px-4 py-2"
                onClick={() => toggleContent()}
              >
                Videos
              </button>
            </span>
          )}
        </div>
        <div className="col-md-5 d-flex searchbar">
          <input
            placeholder="Search for free photos"
            className="form-control rounded-0 me-0"
            onChange={(e) =>
              setQuery(e.target.value ? e.target.value : "nature")
            }
            type="search"
          />
          <button className="custom-btn px-4" onClick={() => handleSearch()}>
            Search
          </button>
        </div>
      </nav>

      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-dialog-centered ">
          <div class="modal-content rounded-0">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel"></h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            {showVideos ? (
              <video
                src={selected}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                className="rounded-0"
                controls
              />
            ) : (
              <div class="modal-body p-1">
                <img src={selected} style={{ width: "100%" }} />
              </div>
            )}
          </div>
        </div>
      </div>

      <main>
        {loading ? (
          <div>
            <h3>Loading...</h3>
            <div className="spinner-border text-success" role="status">
              <span className="sr-only"></span>
            </div>
          </div>
        ) : (
          <>
            {showVideos ? (
              <div className="row m-0">
                {videos
                  .filter((_, index) => index >= low && index <= high)
                  .map((video, index) => (
                    <div className="container col-sm-6 col-md-3 p-1">
                      <img
                        src={video.image}
                        style={{
                          width: "100%",
                          height: "16rem",
                        }}
                        className="rounded-0"
                      />
                      <div className="play-btn-container">
                        <i
                          className="fa fa-play play-btn-icon"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => setSelected(video.video_files[1].link)}
                        ></i>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="row m-0">
                {images
                  .filter((_, index) => index >= low && index <= high)
                  .map((image, index) => (
                    <div className="container col-sm-6 col-md-3 p-1">
                      <img
                        src={image.src.large}
                        style={{
                          width: "100%",
                          height: "16rem",
                        }}
                        className="rounded-0"
                      />
                      <div className="overlay">
                        <p className="fs-5">
                          {image.alt.substring(
                            0,
                            Math.min(70, image.alt.length)
                          )}
                        </p>
                        <p>by {image.photographer}</p>
                        <button
                          type="button"
                          class="custom-btn px-3 py-2 me-1"
                          data-bs-toggle="modal"
                          data-bs-target="#exampleModal"
                          onClick={() => setSelected(image.src.large)}
                        >
                          View <i className="fa fa-eye"></i>
                        </button>
                        <button
                          className="custom-btn py-2 px-3"
                          onClick={() => download(image.src.large2x, image.alt)}
                        >
                          Download <i className="fa fa-download"></i>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}
        <div className="mt-1">
          <button
            className="custom-btn py-2 px-4 me-2"
            onClick={() => handlePrev()}
          >
            &lt;&lt; Prev
          </button>
          <button className="custom-btn py-2 px-4" onClick={() => handleNext()}>
            Next &gt;&gt;
          </button>
        </div>
      </main>

      <footer className="p-3 text-center">
        Copywright © Akash Sardar, 2023
      </footer>
    </div>
  );
}

export default App;
