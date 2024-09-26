import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import GetGeoLocation from "./geolocation";
import getBikeData from "../axios/getBIkeData";

export default function KakaoMap() {
  const [bikeData, setbikeData] = useState();
  const [bikePositionData, setbikePositionData] = useState([]);
  const [selectedStationId, setSelectedStationId] = useState(null); // 선택된 마커의 ID를 저장

  useEffect(() => {
    getBikeData()
      .then((data) => {
        setbikePositionData(data.row);
        setbikeData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const tmp = () => {
    console.log(bikeData);
    console.log(bikePositionData);
  };

  const handleMarkerClick = (stationId) => {
    if (selectedStationId === stationId) {
      setSelectedStationId(null); // 이미 클릭된 마커를 클릭하면 InfoWindow 닫기
    } else {
      setSelectedStationId(stationId); // 새 마커 클릭 시 InfoWindow 열기
    }
  };

  return (
    <>
      <button onClick={tmp}>Show Bike Data</button>

      <Map
        center={{
          lat: 37.55564880,
          lng: 126.91062927,
        }}
        style={{
          width: "100%",
          height: "450px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
        level={5}
      >
        {/* 지도 중앙에 마커 표시 */}
        <MapMarker
          position={{
            lat: 37.558306,
            lng: 127.005342,
          }}
        />
        <GetGeoLocation></GetGeoLocation>
        {/* bikePositionData에 있는 각 정류소 데이터를 기반으로 마커와 InfoWindow 생성 */}
        {bikePositionData.map((station) => (
          <MapMarker
            key={station.stationId}
            position={{
              lat: parseFloat(station.stationLatitude),
              lng: parseFloat(station.stationLongitude),
            }}
            clickable={true} // 클릭 가능 설정
            onClick={() => handleMarkerClick(station.stationId)} // 클릭 시 마커 정보 표시
          >
            {/* 클릭된 마커에만 InfoWindow 표시 */}
            {selectedStationId === station.stationId && (
              <div style={{ minWidth: "250px", position: "relative" }}>
                <div
                  style={{
                    padding: "10px",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                    color: "#333",
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                    fontSize: "13px",
                  }}
                  onClick={() => setSelectedStationId(null)} 
                >
                  <strong>정류소 이름 :</strong> {station.stationName}
                  <br />
                  <strong>자전거 개수 :</strong> {station.parkingBikeTotCnt}
                </div>
                
              </div>
            )}
          </MapMarker>
        ))}
      </Map>
    </>
  );
}
