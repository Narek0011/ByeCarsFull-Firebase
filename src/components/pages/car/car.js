import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {db} from "../../../firebaseService";
import { doc, getDoc} from "@firebase/firestore";
import styles from "./car.module.css";
import clock from "../../../assets/images/clock.png";
import road from "../../../assets/images/1234.png";

const Car = ({setShowHeaderAndFooter}) => {
  const [dataCar,setDataCar] = useState([]);
  const {id} = useParams();

  useEffect(() => {
    setShowHeaderAndFooter(true);
  },[]);

  const getCar = async () => {
      const docRef = doc(db, "cars", id);
      await getDoc(docRef).then(res => {
      let data = res.data();
      setDataCar([data]);
    });
  };

  useEffect(() => {
      getCar().then()
  },[]);

  return (
    <div>
      {
        dataCar && dataCar.map((car) => (
          <div style={{padding:90}} key={car.id}>
            <div className={styles.cardContainer}>
              <img src={car.image} alt="#"/>
              <div className={styles.mobileWersion}>
                <div><span className={styles.typeCar}>{car.type}</span></div>
                <div><b>{car.brand}</b></div>
                <span className={styles.priceCar}>{car.price}<span className={styles.ulLiPrice}> 245 180 грн</span></span>
                <p className={styles.saleCars}>{car.sale}</p>
              </div>
              <div className={styles.computerWrsion} style={{paddingLeft: 20}}>
                <div className={styles.rowOnes}>
                  <span className={styles.typeCar}>{car.type}</span>
                  <span className={styles.priceCar}>{car.price}$</span>
                </div>
                <div className={styles.rowTwos}><b>{car.brand}</b><span className={styles.saleCars}>{car.sale}</span></div>
                <div className={styles.yearCar}>
                  <p><span><img src={clock}  alt="#"/> 2009</span></p>
                  <div className={styles.location} />
                  <span className={styles.locationCar}>{car.location}</span>
                </div>
                <div style={{display: "flex"}}>
                  <p style={{width:78}}>
                    <div className={styles.automatically} />
                    <span className={styles.autoMat}>{car.box}</span></p>
                  <div className={styles.car} />
                  <span className={styles.sedanCar}>{car.sedan}</span>
                </div>
                <div style={{display: "flex"}}>
                  <div className={styles.oil} />
                  <span className={styles.oilCar}>{car.petrol}</span>
                  <span className={styles.mileage}><img src={road} alt="#"/>{car.mileage}</span>
                </div>
                <div style={{display: "flex"}}>
                  <span className={styles.addDate}>Добавлено:21.08.202018:00</span>
                  <div className={styles.storyPrice}>
                    <div className={styles.statistic} />
                    <span style={{fontSize: 10, color: 'green'}}>История цен</span>
                  </div>
                </div>
              </div>

              <div className={styles.containerLink}>
                <div className={styles.price}>
                  <ul>
                    <li>24580 грн</li>
                  </ul>
                </div>
                <div className={styles.linkInCar}>
                  <p className={styles.link}>Ссылки на авто:</p>
                  <div className={styles.cartImages}>
                    <div className={styles.imageOne}/>
                    <div className={styles.imageTwo}/>
                    <div className={styles.imageTree}/>
                  </div>
                  <div className={styles.rst}/>
                  <div className={styles.messageContainer}>
                    <p className={styles.message}>Обьявлений от <br/> продавца:</p>
                    <span className={styles.number}>1</span>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.mobileDataCars}>
              {/*1*/}
              <div>
                <span><img alt="#" src={clock} /> {car.year}</span>
                <span className={styles.locationCar}>{car.location}</span>
              </div>
              {/*2*/}
              <div style={{display: 'flex', marginTop: 16}}>
                <div className={styles.automatically}/>
                <span>{car.box}</span>
                <div className={styles.car}/>
                <span style={{marginLeft: 10}}>{car.sedan}</span>
              </div>
              {/*3*/}
              <div style={{display: 'flex', marginTop: 16}}>
                <div className={styles.oil}/>
                <span style={{marginLeft: 5}}>{car.petrol}</span>
                <span className={styles.mileage}> <span className={styles.escape}><img alt="#" src={road}/>{car.mileage}</span> </span>
              </div>
              {/*4*/}
              <div style={{display: 'flex'}}>
                <div className={styles.storyPrice}>
                  <div className={styles.statistic}/>
                  <span style={{fontSize: 10, color: 'green'}}>История цен</span>
                </div>
                <div style={{marginTop: 22, marginLeft: 29}}>
                  <span className={styles.addDate}>Добавлено:21.08.2020 18:00</span>
                </div>
              </div>
            </div>
            <div className={styles.mobileLinkInCar}>
              <div>
                <span className={styles.link}>Ссылки на авто:</span>
              </div>
              <div className={styles.cartImages}>
                <div className={styles.imageOne}/>
                <div className={styles.imageTwo}/>
                <div className={styles.imageTree}/>
                <div className={styles.rst}/>
                <div className={styles.rowTop}/>
                <div className={styles.cardText}>
                  <span>Обьявлений от <br/> продавца:</span>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

export default Car;
