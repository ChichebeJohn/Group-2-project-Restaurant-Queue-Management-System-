import Image from "next/image";
import Link from "next/link";
import styles from "./landing.module.css";
import { Pinyon_Script } from "next/font/google";


const pinyonScript = Pinyon_Script({
  weight: "400", // or the desired weight
  subsets: ["latin"],
});

export default function Home() {
  return (
    <>
      <header className={styles.welcome}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p className={`${styles.businessName} ${pinyonScript.className}`} style={{color:"#FF0000" ,paddingTop: "50px"}}>
            Highway-Bistro
          </p>
          <Image src="/vector.png" alt="gradient" width={343} height={337} />
          <Link href="./auth/login">
          <button className={styles.loginBtn}>Login</button>
          </Link>
        </div>
        <div className={styles.descriptionParent}>
          <div className={styles.descriptionContainer}>
            <h1>Fresh, Fast, and Delicious!</h1>
            <p>
              Order Now and Skip the Wait with <br />
              Our Digital Queue System.
            </p>
            <div>
              <Link href="./menu">
              <button className={styles.orderBtn}>Order Now</button>
              </Link>
            </div>
          </div>
          <div style={{ overflow: "hidden" }}>
            <Image
              src="/vector0.png"
              alt="Gradient"
              width={396}
              height={383}
              className={styles.gradientImage}
            />
          </div>
          <Image
            src="/chef.png"
            alt="Chef Image"
            width={408}
            height={511}
            className={styles.chef}
          />
        </div>
      </header>

      <div className={styles.container}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            textAlign: "center",
            justifyContent: "center",
            
          }}
        >
          <h1 style={{ fontWeight: "bolder", fontSize: "40px" }}>Our Services</h1>
          <p style={{ fontSize: "24px", paddingBottom: "150px" }}>
            Here below are the solutions we offer
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p style={{ fontWeight: "bold", fontSize: "24px" }}>
              Seamless Online Ordering:
            </p>
            <p style={{ fontSize: "20px", paddingBottom: "60px" }}>
              Place your order from the comfort of your device <br />
              and avoid long queues
            </p>
            <Image
              src="/waiter.png"
              alt="Waiter Image"
              width={457}
              height={584}
              style={{ marginBottom: "150px" }}
            />

            <p style={{ fontWeight: "bold", fontSize: "24px", paddingBottom: "10px" }}>
              Digital Queue Management:
            </p>
            <p style={{ fontSize: "20px", paddingBottom: "60px" }}>
              Get assigned a queue number instantly <br />
              and enjoy a hassle-free waiting experience.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", textAlign: "right" }}>
            <Image
              src="/cashier.png"
              alt="Cashier Image"
              width={455}
              height={543}
              style={{ marginTop: "-150px", marginLeft: "200px" }}
            />
            <p
              style={{
                fontWeight: "bold",
                fontSize: "24px",
                paddingBottom: "10px",
                paddingTop: "100px",
                paddingRight: "100px",
              }}
            >
              Real-Time Order Tracking:
            </p>
            <p style={{ fontSize: "20px", paddingBottom: "150px", paddingRight: "100px" }}>
              Stay updated with your order <br />
              status and estimated preparation time.
            </p>

            <Image
              src="/tab.png"
              alt="Mobile Tablet"
              width={585}
              height={439}
              style={{ marginLeft: "150px" }}
            />
          </div>
        </div>
      </div>

      <footer style={{ margin: 0, padding: 0 }}>
      <div
  style={{
    backgroundColor: "#D9D9D9",
    width: "100%",
    height: "820px",
    padding: "100px",
    position: "relative",
    
  }}
>
  {/* Main peek-menu image */}
  <Image
    src="/peek-menu.png"
    alt="A Look at Our Menu"
    width={1134}
    height={590}
    style={{overflow:"hidden"}}
  />

  {/* Overlay container for the shadow image and navigation text */}
  <Link href="/menu">
    <div
      style={{
        position: "absolute",
        bottom: "130px", // position from the bottom of the parent container
        left: "49%",
        transform: "translateX(-50%)", // center horizontally
        width: "1190px",
        height: "200px",
        backgroundImage: "url('/shadow.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        // border:"5px solid black",
        borderRadius:"50px",
        textAlign:"left",
        justifyContent:"left",
        paddingLeft:"110px"
      }}
    >
      <span
        style={{
          color: "#fff",
          fontWeight: "bold",
          fontSize: "18px",
          textAlign: "center",
        }}
      >
        Place Your Order Now &raquo;
      </span>
    </div>
  </Link>
</div>
<div style={{backgroundColor:"#0D0C0C", padding:"100px", height:"400px"}}>
<div style={{display:"flex", flexDirection:"row"}}>
<div>
<p className={`${styles.businessName} ${pinyonScript.className}`} style={{color:"#FCB900"}}>
            Highway-Bistro
          </p>
          <p style={{color:"white", paddingBottom:"10px"}}> Highway bistro</p>
          <p style={{color:"white"}}>Gallery of Code, First Floor, Ocean Centre, Plot 1018 <br/>
          Cadastral Zone B18, Off Oladipo Diya Road, Gudu Abuja.</p>
</div>
<div style={{display:"flex", flexDirection:"row", gap:"70px"}}>
  <div style={{color:"white", gap:"20px", paddingTop:"15px"}}>
  <h3 style={{paddingBottom:"10px"}}>Quick links</h3>
  <p style={{paddingBottom:"10px"}}>Home</p>
  <p>Why choose us</p>
  <p></p>
  </div>
  <div style={{color:"white", gap:"20px", paddingTop:"15px"}}>
  <h3 style={{paddingBottom:"10px"}}>Contact</h3>
  <p style={{paddingBottom:"10px"}}>cyberschoolafrica78@gmail.com </p>

<p style={{paddingBottom:"10px"}}> 07070818905 </p>

<p style={{paddingBottom:"10px"}}>09035867277</p>

  </div>
</div>
</div>
<div style={{width:"95%", height:"1px", backgroundColor:"#A5A5A5", marginTop:"100px"}}></div>
<p style={{color:"white", justifyContent:"center", justifySelf:"center", paddingTop:"10px"}}> copyright © capstone-group-2, Cyber School Africa</p>
</div>

      </footer>
    </>
  );
}
