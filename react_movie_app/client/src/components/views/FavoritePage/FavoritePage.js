import Axios from "axios";
import React, { useEffect, useState } from "react";
import "./favorite.css";
import { Popover } from "antd";
import { IMAGE_BASE_URL } from "../../Config";

function FavoritePage() {
  const [Favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavoredMovie();
  }, []);

  const fetchFavoredMovie = () => {
    Axios.post("/api/favorite/getFavoriteMovie", {
      userFrom: localStorage.getItem("userId"),
    }).then((response) => {
      if (response.data.success) {
        setFavorites(response.data.favorites);
      } else {
        alert("영화 정보를 가져오는데 실패 했습니다.");
      }
    });
  };

  const onClickDelete = (movieId, userFrom) => {
    const variables = {
      movieId,
      userFrom,
    };

    Axios.post("/api/favorite/removeFromFavorite", variables).then(
      (response) => {
        if (response.data.success) {
          // 디비에서 리스트 삭제 처리 후
          // 리스트화면은 어떻게??
          // 1. useState에 있는 거 삭제
          // 2. getFavoriteMovie api 다시 호출 (예제에서는 이거)
          fetchFavoredMovie();
        } else {
          alert("리스트에서 지우는데 실패했습니다.");
        }
      }
    );
  };

  const renderCards = Favorites.map((favorite, index) => {
    const content = (
      <div>
        {favorite.moviePost ? (
          <img src={`${IMAGE_BASE_URL}w500${favorite.moviePost}`} />
        ) : (
          "no image"
        )}
      </div>
    );
    return (
      <tr key={index}>
        <Popover content={content} title={`${favorite.movieTitle}`}>
          <td>{favorite.movieTitle}</td>
        </Popover>
        <td>{favorite.movieRunTime}</td>
        <td>
        {/* <button onClick={onClickDelete(favorite.movieId, favorite.userFrom)}> */}
        {/* 이러면 onClick이벤트 발생안해도 함수가 실행됨 . 주의! */}
          <button onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}>
              Remove
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h2>Favorite Movies</h2>
      <hr />

      <table>
        <thead>
          <tr>
            <th>Movie Title</th>
            <th>Movie Runtime</th>
            <th>Remove from favorites</th>
          </tr>
        </thead>
        <tbody>{renderCards}</tbody>
      </table>
    </div>
  );
}

export default FavoritePage;
