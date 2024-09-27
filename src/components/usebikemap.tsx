import { Map, MapMarker } from "react-kakao-maps-sdk";
import { SetStateAction, useEffect, useState } from "react";
import getBikeData from "../axios/getBIkeData";


interface Station {
    stationId: string;
    stationLatitude: string;
    stationLongitude: string;
    stationName: string;
    parkingBikeTotCnt: number;
  }

export default function BasicMap() {


  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [bikePositionData, setbikePositionData] = useState<Station[]>([]);

  // 자전거 api에서 데이터 받아와서 저장
  useEffect(() => {
    getBikeData()
      .then((data) => {
        setbikePositionData(data.row);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

const handleMarkerClick = (stationId: string) => {
    setSelectedStationId(stationId);
  };
  return (
    <>
      <Map
        center={{
          lat: 37.558306,
          lng: 127.005342,
        }}
        style={{
          width: "100%",
          height: "450px",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        }}
        level={5}
      >
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
