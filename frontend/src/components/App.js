import { useEffect, useState } from "react";
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
import auth from "../utils/auth";
import InfoTooltip from "./InfoTooltip";
import wrong from "../images/wrong.svg";
import ok from "../images/ok.svg";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [email, setEmail] = useState('');
  const [isLogged, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [infoTooltip, setInfoTooltip] = useState(false);
  const [infoTooltipImage, setinfoTooltipImage] = useState("");
  const [infoTooltipTitle, setInfoTooltipTitle] = useState("");

  useEffect(() => {
    tokenCheck()
    if (isLogged) {
      Promise.all([api.getUserInfo(), api.getInitialCards()])
        .then(([userData, cardsData]) => {
          setCurrentUser(userData);
          setCards(cardsData);
        })
        .catch((error) => console.log(error));
        }
  }, [isLogged]);


  const tokenCheck = () => {
    const token = localStorage.getItem('token');
    if (token && isLogged) {
      auth.getToken(token).then((res) => {
          if (res) {
            setIsLoggedIn(true);
            setEmail(res.data.email); //?
            navigate("/", { replace: true });
          }
        })
        .catch((err) => console.error(err))
    }
  };

  const handleEditAvatarClick = () => setIsEditAvatarPopupOpen(true);
  const handleEditProfileClick = () => setIsEditProfilePopupOpen(true);
  const handleAddPlaceClick = () => setIsAddPlacePopupOpen(true);
  const handleCardClick = (card) => setSelectedCard(card);

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setInfoTooltip(false);
    setSelectedCard({});
  };

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) =>
          state.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete (card) {
    api
      .deleteCard(card._id)
      .then(() => {
        setCards((state) => state.filter((i) => i._id !== card._id));
      })
      .catch((error) => console.log(error));
  };

  function handleUpdateUser (newData) {
    api
      .setUserInfo(newData)
      .then((newData) => {
        setCurrentUser(newData);
        closeAllPopups();
      })
      .catch((error) => console.log(error));
  };

  function handleUpdateAvatar (data) {
    api
      .setUserAvatar(data)
      .then((newData) => {
        setCurrentUser(newData);
        closeAllPopups();
      })
      .catch((error) => console.log(error));
  };

  function handleAddPlacePopup (card) {
    api
      .addCard(card)
      .then((newCards) => {
        setCards([newCards, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  };

  function onLogin(email, password) {
    auth
      .login(email, password)
      .then((res) => {
        localStorage.setItem('token', res.token);
        setIsLoggedIn(true);
        setEmail(email);
        navigate("/", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        handleInfoTooltip();
        setinfoTooltipImage(wrong);
        setInfoTooltipTitle("Что-то пошло не так! Попробуйте еще раз.");
      });
  }

  function onRegister(email, password) {
    auth
      .registration(email, password)
      .then(() => {
        setinfoTooltipImage(ok);
        setInfoTooltipTitle("Вы успешно зарегистрировались!");
        navigate("/sign-in", { replace: true });
      })
      .catch((err) => {
        console.log(err);
        setinfoTooltipImage(wrong);
        setInfoTooltipTitle("Что-то пошло не так! Попробуйте еще раз.");
      })
      .finally(handleInfoTooltip);
  }

  function onSignOut() {
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    navigate("/sign-in");
    setEmail("");
  }

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
            <Route path="*" element={<Navigate to="/" />} />
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
