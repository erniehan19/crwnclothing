import { Fragment, useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import {ReactComponent as CrwnLogo } from '../../assets/crown.svg';
import { UserContext } from "../../contexts/user.contexts";
import { signOutUser } from "../../utils/firebase/firebase.utils";
import CartIcon from "../../component/cart-icon/cart-icon.component";
import CartDropdown from "../../component/cart-dropdown/cart-dropdown.component";
import { CartContext } from "../../contexts/cart.context";

import { NavigationContainer, NavLink, NavLinks, LogoContainer } from "./navigation.styles";

const Navigation = () => {
  const {currentUser} = useContext(UserContext);
  const {isCartOpen} = useContext(CartContext);

    return (
      <Fragment>
        <NavigationContainer>
          <LogoContainer to='/'>
            <CrwnLogo className="logo"/>
          </LogoContainer>
          <NavLinks>
            <NavLink to='/shop'>
                SHOP
            </NavLink>
            {
              currentUser ? (<NavLink as='span' onClick={signOutUser}>SIGN OUT</NavLink> )
                : (<NavLink className="nav-link" to='/auth'>SIGN IN</NavLink>)
            }
            <CartIcon />
          </NavLinks>
          {isCartOpen && <CartDropdown />}
        </NavigationContainer>
        <Outlet />
      </Fragment>
    );
  };

  export default Navigation;