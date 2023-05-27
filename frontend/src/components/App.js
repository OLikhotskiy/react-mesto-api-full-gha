import { useEffect, useState, useCallback } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";
import InfoTooltip from "./InfoTooltip";
import wrong from "../images/wrong.svg";
import ok from "../images/ok.svg";

function App() {
  const [isLogged, setIsLoggedIn] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [email, setEmail] = useState(null);
  
  const navigate = useNavigate();
  const [infoTooltip, setInfoTooltip] = useState(false);
  const [infoTooltipImage, setinfoTooltipImage] = useState("");
  const [infoTooltipTitle, setInfoTooltipTitle] = useState("");

  const handleTokenCheck = useCallback(async () => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      try {
        const user = await api.getInfo(jwt)
        const cards = await api.getInitialCards(jwt)

        if (!user) {
          throw new Error("Нет данных");
        }
        setCurrentUser(user);
        setCards(cards.data);
        setIsLoggedIn(true);
        setEmail(user.email);
        navigate("/");
      } catch (e) {
        console.error(e);
      } 
    } 
  }, [navigate]);

  useEffect(() => {
    handleTokenCheck();
  }, []);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(true);
  };

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(true);
  };

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(true);
  };
  
  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleCardDelete = (card) => {
    const jwt = localStorage.getItem("jwt");
    api
      .deleteCard(card._id, jwt)
      .then(() => {
        setCards((state) => state.filter((i) => i._id !== card._id));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateUser = (newData) => {
    const jwt = localStorage.getItem('jwt');
    api
      .setUserInfo(newData, jwt)
      .then((newData) => {
        setCurrentUser(newData);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleUpdateAvatar = (data) => {
    const jwt = localStorage.getItem('jwt');
    api
      .setUserAvatar(data, jwt)
      .then((newData) => {
        setCurrentUser(newData);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleAddPlacePopup = (card) => {
    const jwt = localStorage.getItem('jwt');
    api
      .addCard(card, jwt)
      .then((newCards) => {
        setCards([newCards, ...cards]);
      })
      .then(() => {
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    const jwt = localStorage.getItem('jwt');
    api
      .changeLikeCardStatus(card._id, !isLiked, jwt)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setInfoTooltip(false);
    setSelectedCard({});
  };

  
  const onLogin = useCallback(
    async (info) => {
    try {
      const data = await auth.login(info);
      if (data.token) {
        localStorage.setItem("jwt", data.token);
        setIsLoggedIn(true);
        setEmail(info.email);
        navigate("/", { replace: true });
        handleTokenCheck();
      }
    } catch (err) {
        console.log(err);
        handleInfoTooltip();
        setinfoTooltipImage(wrong);
        setInfoTooltipTitle("Что-то пошло не так! Попробуйте еще раз.");
      }
    },
    [navigate]
  );
  

  const onRegister = useCallback (
    async (info) => {
      try {
        const data = await auth.registration(info);
        if (data) {
        setinfoTooltipImage(ok);
        setInfoTooltipTitle("Вы успешно зарегистрировались!");
        navigate("/sign-in", { replace: true });
      }
      } catch (err) {
        console.log(err);
        setinfoTooltipImage(wrong);
        setInfoTooltipTitle("Что-то пошло не так! Попробуйте еще раз.");
      }
    }, 
    [navigate]
  );

  const onSignOut = useCallback(() => {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    navigate("/sign-in", { replace: true });
    setEmail("");
  }, 
  [navigate]
  );

  function handleInfoTooltip() {
    setInfoTooltip(true);
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header onLogOut={onSignOut} email={email} />
        <Routes>
          <Route path="/sign-in" element={<Login onLogin={onLogin} />} />
          <Route
            path="/sign-up"
            element={<Register onRegister={onRegister} />}
          />
          <Route
              path="*"
              element={
                isLogged ? <Navigate to="/" /> : <Navigate to="/sign-in" />
              }
              />
          <Route
            path="/"
            element={
              <>
                <ProtectedRoute
                  component={Main}
                  isLogged={isLogged}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  cards={cards}
                  onCardLike={handleCardLike}
                  onCardDelete={handleCardDelete}
                />
                <Footer />
              </>
            }
          />
        </Routes>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlace={handleAddPlacePopup}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          image={infoTooltipImage}
          title={infoTooltipTitle}
          isOpen={infoTooltip}
          onClose={closeAllPopups}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
