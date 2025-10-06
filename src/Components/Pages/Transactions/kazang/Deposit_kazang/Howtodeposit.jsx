import { useState } from "react";
import StickyHeader from "../../../../layouts/Header/Header";
import Sidebar from "../../../../layouts/Header/Sidebar";

export default function DepositMethods() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const methods = [
    {
      id: 1,
      title: "Kazang",
      img: "/assets/img/footer_icon/1 (1).jpg",
      notice: (
        <div className="text-center my-3">
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#e4063b" }}>
            To Make an INSTANT KAZANG DEPOSIT, you must be logged in.
          </p>
        </div>
      ),
      steps: [
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_kazang-step00.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_kazang-step01.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_kazang-step02a.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_kazang-step03.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_kazang-step04.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_kazang-step05.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_kazang-step06a.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_kazang-step07.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_kazang-step10c.jpg",
      ],
    },
    {
      id: 2,
      title: "FNB USSD",
      img: "/assets/img/footer_icon/1 (2).jpg",
      notice: (
        <div className="text-center my-3">
          <p>
            Did you already make an FNB Ewallet deposit? Please{" "}
            <strong>login</strong> and fill out the deposit confirmation form to
            let us know you sent money so our banking team can credit your
            player wallet FAST!
          </p>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#e4063b" }}>
            To Confirm an FNB eWallet deposit, you must be logged in.
          </p>
        </div>
      ),
      steps: [
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbussd-step01.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbussd-step02.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbussd-step03.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbussd-step04.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbussd-step05.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbussd-step06.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbussd-step07.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbussd-step08.jpg",
      ],
    },
    {
      id: 3,
      title: "FNB App",
      img: "/assets/img/footer_icon/1 (3).jpg",
      notice: (
        <div className="text-center my-3">
          <p>
            Did you already make an FNB Ewallet deposit? Please{" "}
            <strong>login</strong> and fill out the deposit confirmation form to
            let us know you sent money so our banking team can credit your
            player wallet FAST!
          </p>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#e4063b" }}>
            To Confirm an FNB eWallet deposit, you must be logged in.
          </p>
        </div>
      ),
      steps: [
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbapp-step01.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbapp-step02.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbapp-step03.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_fnbapp-step04.jpg",
      ],
    },
    {
      id: 4,
      title: "Windhoek Easy Wallet",
      img: "/assets/img/footer_icon/1 (4).jpg",
      notice: (
        <div className="text-center my-3">
          <p>
            Did you already make a Bank Windhoek Easy Wallet deposit? Please{" "}
            <strong>login</strong> and fill out the deposit confirmation form to
            let us know you sent money so our banking team can credit your
            player wallet FAST!
          </p>
          <p style={{ fontSize: "20px", fontWeight: "bold", color: "#e4063b" }}>
            To Confirm a Bank Windhoek Easy Wallet deposit, you must be logged
            in.
          </p>
        </div>
      ),
      steps: [
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_windhoek-step01.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_windhoek-step02.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_windhoek-step03.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_windhoek-step04.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_windhoek-step06.jpg",
        "https://m.castlebet.com.na/custom_content/translated/en-EN/img/dep_windhoek-step07.jpg",
      ],
    },
  ];

  const [activeMethod, setActiveMethod] = useState(methods[0].id);

  return (
    <>
      <StickyHeader onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="container py-5">
              <h3 className="text-center mb-5 fw-600 text-white ">
                How to Deposit
              </h3>

              {/* --- Method Cards Row --- */}
              <div className="row g-4 justify-content-center mb-5">
                {methods.map((method) => (
                  <div
                    key={method.id}
                    className="col-6 col-sm-4 col-md-3 col-lg-3 col-xl-2 "
                  >
                    <div
                      className={`card h-100 text-center border-0 shadow-lg bg-clr ${
                        activeMethod === method.id
                          ? "border-primary border-3 shadow-lg"
                          : ""
                      }`}
                      onClick={() => setActiveMethod(method.id)}
                      style={{
                        cursor: "pointer",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        background: "#292524 !important",
                      }}
                    >
                      <img
                        src={method.img}
                        className="card-img-top rounded-top p-2"
                        alt={method.title}
                        style={{
                          objectFit: "contain",
                          background: "#292524 !important",
                        }}
                      />
                      <div className="card-body p-2">
                        <h5 className="card-title mb-0 text-white">
                          {method.title}
                        </h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* --- Notice + Steps Section --- */}
              {methods.map(
                (method) =>
                  activeMethod === method.id && (
                    <div key={method.id} className="mb-5">
                      {/* Notice */}
                      {method.notice}

                      {/* Steps */}
                      <div className="row g-4">
                        {method.steps.map((stepImg, index) => (
                          <div
                            key={index}
                            className="col-12 col-sm-6 col-md-4 col-lg-3"
                          >
                            <div
                              className="card h-100 text-white shadow-sm hover-shadow bg-clr p-2"
                              style={{ background: "#292524 !important" }}
                            >
                              <div className="position-relative">
                                <span className="badge bg-danger position-absolute top-0 start-0 m-2">
                                  Step {index + 1}
                                </span>
                                <img
                                  src={stepImg}
                                  className="card-img-top rounded-top"
                                  alt={`Step ${index + 1}`}
                                  style={{
                                    objectFit: "cover",
                                    background: "#292524 !important",
                                  }}
                                />
                              </div>
                              {/* <div className="card-body p-2 text-center">
                                <p className="mb-0 text-white">
                                  Step {index + 1}
                                </p>
                              </div> */}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
