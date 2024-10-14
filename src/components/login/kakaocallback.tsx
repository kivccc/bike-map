import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

interface ApiResponse {
  result: {
    user_id: string;
    jwt: string;
  };
}

export function KakaoRedirect() {
  const navigate = useNavigate();
  const code: string | null = new URL(window.location.href).searchParams.get("code");

  console.log(code);

  const headers: HeadersInit = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  useEffect(() => {
    fetch(`보내줄 주소?code=${code}`, {
      method: "POST",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data: ApiResponse) => {
        console.log(data);
        console.log(data.result.user_id);
        console.log(data.result.jwt);
      })
      .catch((error) => {
        console.error("오류 발생", error);
      });
  }, [code]);

  return <div>로그인 중입니다.</div>;
}

export default KakaoRedirect;
