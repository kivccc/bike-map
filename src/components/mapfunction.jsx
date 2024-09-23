import  { Map, MapMarker } from "react-kakao-maps-sdk";
import getBikeData from "../axios/getBIkeData";
import { useEffect, useState } from "react";

export default function KakaoMap(){
  
  const [bikeData, setbikeData] = useState();
  const [bikePositionData, setbikePositionData] = useState([]);


  useEffect(() => {
    getBikeData()
    .then(data => {

      setbikePositionData(data.row);


      setbikeData(data);   
    })
      .catch(error => {
        // 데이터 가져오기 실패 시 에러 처리
      console.error('Error fetching data:', error);
    });
  }, []);

  const tmp = () => {
    console.log(bikeData);
    console.log(bikePositionData);
  };

  return (
    <>
    <div>
      <button onClick={tmp}>Show Bike Data</button>
    </div>

    <Map // 지도를 표시할 Container
      center={{
        // 지도의 중심좌표
        lat: 37.55564880,
        lng: 126.91062927,
      }}
      style={{
        // 지도의 크기
        width: "100%",
        height: "450px",
      }}
      level={5} // 지도의 확대 레벨
    >
      <MapMarker // 마커를 생성합니다
        position={{
          // 마커가 표시될 위치입니다
          lat: 37.55564880,
          lng: 126.91062927,
        }}
      />
        {bikePositionData.map((station, index) => (
          <MapMarker
            key={station.stationId} // 고유한 stationId를 key로 사용
            position={{
              lat: parseFloat(station.stationLatitude), // 문자열을 숫자로 변환
              lng: parseFloat(station.stationLongitude),
            }}
            title={station.stationName} // 마커에 해당 대여소 이름을 표시
          />
        ))}
    </Map>

    </>
  );
}