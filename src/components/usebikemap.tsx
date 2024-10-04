import { Map, MapMarker ,CustomOverlayMap} from "react-kakao-maps-sdk";
import { SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import getBikeData from "../axios/getBIkeData";
import useGeoLocation from "./usegeolocation";
import CustomGeoMarker from "../images/geomarker.png"
import "../assets/style.css"

import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect"


interface Station {
    stationId: string;
    stationLatitude: string;
    stationLongitude: string;
    stationName: string;
    parkingBikeTotCnt: number;
  }


  interface LatLng {
    lat: number;
    lng: number;
  }
  
  interface Point {
    x: number;
    y: number;
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

 
  const startPoint = useRef<Point>({ x: 0, y: 0 });
  const overlayPoint = useRef<any>(null);
  const mapRef = useRef<any>(null);  


  const location = useGeoLocation(); // Use the custom hook to get the user's location
  const [position, setPosition] = useState<LatLng>({
    lat: 37.54699, // Default fallback coordinates
    lng: 127.09598,
  });
  const [startposition, setStartPosition] = useState<LatLng>({
    lat: 37.54699, // Default fallback coordinates
    lng: 127.09598,
  });

    // Update the position when the user's location is available
    useEffect(() => {
      if (location) {
        setPosition({
          lat: location.lat,
          lng: location.lng,
        });
        setStartPosition({
          lat: location.lat,
          lng: location.lng,
        });
      }
    }, [location]);
  
    const onMouseMove = useCallback(
      (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const map = mapRef.current;
        if (!map) return;
  
        const proj = map.getProjection();
        let deltaX, deltaY;
  
        if ('clientX' in e) {
          // Mouse move
          deltaX = startPoint.current.x - e.clientX;
          deltaY = startPoint.current.y - e.clientY;
        } else {
          // Touch move
          deltaX = startPoint.current.x - e.touches[0].clientX;
          deltaY = startPoint.current.y - e.touches[0].clientY;
        }
  
        const newPoint = new window.kakao.maps.Point(
          overlayPoint.current.x - deltaX,
          overlayPoint.current.y - deltaY
        );
  
        const newPos = proj.coordsFromContainerPoint(newPoint);
        setPosition({
          lat: newPos.getLat(),
          lng: newPos.getLng(),
        });
      },
      []
    );
  
    const onMouseUp = useCallback(() => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('touchmove', onMouseMove);
    }, [onMouseMove]);
  
    const onMouseDown = useCallback(
      (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        e.preventDefault();
        const map = mapRef.current;
        if (!map) return;
  
        const proj = map.getProjection();
        window.kakao.maps.event.preventMap();
  
        if ('clientX' in e) {
          // Mouse down
          startPoint.current.x = e.clientX;
          startPoint.current.y = e.clientY;
        } else {
          // Touch start
          startPoint.current.x = e.touches[0].clientX;
          startPoint.current.y = e.touches[0].clientY;
        }
  
        overlayPoint.current = proj.containerPointFromCoords(
          new window.kakao.maps.LatLng(position.lat, position.lng)
        );
  
        if ('clientX' in e) {
          // Mouse events
          document.addEventListener('mousemove', onMouseMove);
        } else {
          // Touch events
          document.addEventListener('touchmove', onMouseMove);
        }
      },
      [onMouseMove, position.lat, position.lng]
    );
  
    useEffect(() => {
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('touchend', onMouseUp);
  
      return () => {
        document.removeEventListener('mouseup', onMouseUp);
        document.removeEventListener('touchend', onMouseUp);
      };
    }, [onMouseUp]);






    const [showText, setShowText] = useState(true); // 초기 위치 텍스트 표시 여부 상태
    const hideText = useCallback(() => {
      setShowText(false); // 텍스트 숨기기
    }, []);

  return (
    
    <div className="map-wrapper">
<Map
  id={'map'}
  center={startposition}
  className="map-container"
  level={4}
  ref={mapRef}
>


  {bikePositionData.map((station) => (
    <MapMarker
      key={station.stationId}
      position={{
        lat: parseFloat(station.stationLatitude),
        lng: parseFloat(station.stationLongitude),
      }}
      clickable={true}
      onClick={() => handleMarkerClick(station.stationId)}
    >
      {selectedStationId === station.stationId && (
        <div className="info-window" style={{ position: "relative" }}>
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
 <div className="refresh-button">Refresh</div>
          <CustomOverlayMap position={position}>
          <div
              onMouseDown={!isMobile ? onMouseDown : undefined}
              onTouchStart={isMobile ? onMouseDown : undefined}
              onMouseMove={hideText} className="overlay"
              style={{
                position: "absolute",
                width: "80px", // 마커의 width
                height: "80px", // 마커의 height
                top: "50%", // 중앙 정렬을 위해
                left: "50%",
                transform: "translate(-50%, -100%)", // 마커의 중앙이 기준이 되도록 위치 조정
                backgroundColor: "transparent", // 투명하게
                zIndex: 10, // 마커보다 위에 위치하게 설정
              }}>
          {showText && (
          <div
            style={{
              position: "absolute",
              bottom: "80px", // 마커 위쪽에 위치하게 설정
              left: "50%",
              transform: "translateX(-50%)", // 중앙 정렬
              padding: "5px 10px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
              color: "#333",
              fontSize: "12px",
            }}
          >
            당신의 현재 위치인가요?
            <div>{window.innerWidth}</div>
            <div>{window.innerHeight}</div>
          </div>
        )}
          <MapMarker // 마커를 생성합니다
          position={position}
          image={{
            src: CustomGeoMarker, // 마커이미지의 주소입니다
            size: {
              width: 64,
              height: 69,
            }, // 마커이미지의 크기입니다
            options: {
              offset: {
                x: 27,
                y: 69,
              }, // 마커이미지의 옵션입니다. 마커의 좌표와 일치시킬 이미지 안에서의 좌표를 설정합니다.
            },
          }}
          
        />
        
          </div>
          
        </CustomOverlayMap>
        
</Map>
      </div>
    
  );
}
