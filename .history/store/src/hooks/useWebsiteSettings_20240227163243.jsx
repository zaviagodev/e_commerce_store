


import { createContext, useContext, useState } from 'react';

import { useFrappeGetCall } from 'frappe-react-sdk';

const SettingContext = createContext(null);

export const SettingProvider = ({ children }) => {

    const [appLogo, setAppLogo] = useState(null);
    const [appName, setAppName] = useState('Store');
    const [disableSignup, setDisableSignup] = useState(false);
    const [hideLogin, setHideLogin] = useState(true);
    const [hideCheckout, setHideCheckout] = useState(true);
    const [navbarSearch, setNavbarSearch] = useState(false);
    const [showLanguagePicker, setShowLanguagePicker] = useState(false);
    const [hideFooterSignup, setHideFooterSignup] = useState(true);
    const [hideWish, setHideWish] = useState(true);
    const [footerItems, setFooterItems] = useState([]);
    const [topBarItems, setTopBarItems] = useState([]);
    const [buttonLabel, setButtonLabel] = useState('Add to Cart');
    const [buttonLink, setButtonLink] = useState(null);
    const [defaultTaxe, setDefaultTaxe] = useState(null); 
    const [paymentmethods, setPaymentmethods] = useState([]); 
    var items = []

    const setFavicon = (iconUrl) => {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = `${import.meta.env.VITE_ERP_URL ?? ''}${iconUrl}`;;
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      const recursiveSearch = ( item, itemsParam) => {
        for (let i = 0; i < itemsParam.length; i++) {
            if (itemsParam[i].label === item.parent_label) {
                itemsParam[i].children.push(item)
            }
            if (itemsParam[i].children && itemsParam[i].children.length > 0) {
                recursiveSearch(item, itemsParam[i].children);
            }
        }
    };





    const buildTopBarItems = (data) => {
        items = data
        items.forEach((item) => {
            item.children = []
        })
        
        const itemsCopy = JSON.parse(JSON.stringify(items))
        items.forEach((item) => {
            if( item.hasOwnProperty('parent_label'))
            {
                recursiveSearch(item, itemsCopy)
                const index = itemsCopy.findIndex(copyItem => copyItem.label === item.label)
                if (index !== -1) {
                    itemsCopy.splice(index, 1);  // Supprime l'élément item de items
                 }
            }
        })
        return itemsCopy;
    }



    const { mutate, isLoading } = useFrappeGetCall('e_commerce_store.api.get_websiteSettings', undefined, undefined, {
        isOnline: () => appName == 'Store',
        onSuccess: (data) => {
            setAppLogo(data.message.settings.app_logo);
            setAppName(data.message.settings.app_name);
            setDisableSignup(data.message.settings.disable_signup == 1 ? true : false);
            setHideLogin(data.message.settings.hide_login == 1 ? true : false );
            setHideCheckout(data.message.settings.hide_checkout == 1 ? true : false);
            setNavbarSearch(data.message.settings.navbar_search == 1 ? true : false);
            setShowLanguagePicker(data.message.settings.show_language_picker == 1 ? true : false);
            setHideFooterSignup(data.message.settings.hide_footer_signup == 1 ? true : false);
            setFooterItems(data.message.settings.footer_items);
            setPaymentmethods(data.message.payment_settings);
            setHideWish(data.message.settings.hide_wish == 1 ? true : false);
            setFavicon(data.message.settings.app_logo);
            setButtonLabel(data.message.settings.hide_checkout == 1 ? data.message.settings.button_label : 'เพิ่มลงตะกร้า');
            setButtonLink(data.message.settings.button_link);
            setTopBarItems(buildTopBarItems([...data.message.settings.top_bar_items].sort((a, b) => a.idx - b.idx)));
            setDefaultTaxe(data.message.settings.default_taxe);
            document.title = data.message.settings.app_name;
        }
    })



    return <SettingContext.Provider value={{
        appLogo,
        appName,
        disableSignup,
        hideLogin,
        hideCheckout,
        navbarSearch,
        showLanguagePicker,
        hideFooterSignup,
        footerItems,
        topBarItems,
        defaultTaxe,
        hideWish,
        isLoading,
        buttonLabel,
        buttonLink,
        mutate,
        paymentmethods
    }}>
        {children}
    </SettingContext.Provider>
}

export const useSetting = () => useContext(SettingContext);

