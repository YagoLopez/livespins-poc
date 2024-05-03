import { RootState } from "../../redux/store"
import { useSelector } from "react-redux"
import { useRouter } from "next/router"
import Head from "next/head"
import React from "react"
import LeftArrowIcon from "../../components/icons/LeftArrowIcon"

const GameDetail = () => {
  const router = useRouter()
  const onGoBack = () => router.back()
  const { name, provider, tags } = useSelector((state: RootState) => state.game)

  return (
    <div
      id="carouselExampleCaptionsFull"
      className="fade-in carousel slide carousel-fade relative h-screen"
      data-bs-ride="carousel"
    >
      <Head>
        <title>Game Detail</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="description" content="Game Detail" />
      </Head>

      <div className="carousel-inner relative w-full overflow-hidden h-screen">
        <div className="carousel-item active relative float-left w-full h-screen bg-no-repeat bg-cover bg-center">
          <video
            className="min-w-full min-h-full xl:min-w-0 xl:min-h-0"
            playsInline
            autoPlay
            muted
            loop
          >
            <source className="" src="/vid4.mp4" type="video/mp4" />
          </video>

          <div
            className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          >
            <div className="flex justify-center items-center h-full">
              <div className="text-white text-center px-14 px-md-0 bg-black opacity-60 p-10 rounded-xl border">
                <h2 className="text-3xl font-semibold mb-4">
                  {name || "Game Name"}
                </h2>
                <div className="text-md mb-6">Provided by: {provider}</div>
                <div className="md:space-x-2">
                  <button
                    onClick={onGoBack}
                    type="button"
                    className="inline-flex items-center px-6 py-2 border-2 border-white text-white font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                    role="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    <LeftArrowIcon classes="left-btn" />
                    Back To Games
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="carousel-item relative float-left w-full h-screen bg-no-repeat bg-cover bg-center">
          <video
            className="min-w-full min-h-full xl:min-w-0 xl:min-h-0"
            playsInline
            autoPlay
            muted
            loop
          >
            <source className="" src="/vid2.mp4" type="video/mp4" />
          </video>
          <div
            className="absolute top-0 right-0 bottom-0 left-0 w-full h-full overflow-hidden bg-fixed"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
          >
            <div className="flex justify-center items-center h-full">
              <div className="text-white text-center px-14 px-md-0 w-[600px] bg-black opacity-60 p-10 rounded-xl border">
                <h2 className="text-3xl font-semibold mb-4">Tags</h2>
                <div className="text-md mb-6">
                  {tags?.toLocaleString().replace(/,/g, " - ")}
                </div>
                <div className="md:space-x-2">
                  <button
                    onClick={onGoBack}
                    type="button"
                    className="inline-flex items-center px-6 py-2 border-2 border-white text-white font-medium text-xs leading-tight uppercase rounded hover:bg-black hover:bg-opacity-5 focus:outline-none focus:ring-0 transition duration-150 ease-in-out"
                    role="button"
                    data-mdb-ripple="true"
                    data-mdb-ripple-color="light"
                  >
                    <LeftArrowIcon classes="left-btn" />
                    Back To Games
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        className="carousel-control-prev absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline left-0"
        type="button"
        data-bs-target="#carouselExampleCaptionsFull"
        data-bs-slide="prev"
      >
        <span
          className="carousel-control-prev-icon inline-block bg-no-repeat"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next absolute top-0 bottom-0 flex items-center justify-center p-0 text-center border-0 hover:outline-none hover:no-underline focus:outline-none focus:no-underline right-0"
        type="button"
        data-bs-target="#carouselExampleCaptionsFull"
        data-bs-slide="next"
      >
        <span
          className="carousel-control-next-icon inline-block bg-no-repeat"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  )
}

export default GameDetail
