import Cookies from 'js-cookie';

const TokenKey = 'token';

const getToken = () => Cookies.get(TokenKey);

const setToken = (token) => Cookies.set(TokenKey, token);

const removeToken = () => Cookies.remove(TokenKey);


const getRGBColor = (hex, type) => {
    let color = hex.replace(/#/g, "")
    // rgb values
    var r = parseInt(color.substr(0, 2), 16)
    var g = parseInt(color.substr(2, 2), 16)
    var b = parseInt(color.substr(4, 2), 16)
  
    return `--color-${type}: ${r}, ${g}, ${b};`
  }

const getAccessibleColor = (hex) => {
    let color = hex.replace(/#/g, "")
    // rgb values
    var r = parseInt(color.substr(0, 2), 16)
    var g = parseInt(color.substr(2, 2), 16)
    var b = parseInt(color.substr(4, 2), 16)
    var yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 128 ? "#000000" : "#FFFFFF"
  }


  const  getUserId = () => Cookies.get('user_id');


    // Helper function for recursive search
    const findGroup = (groups, groupName) => {
      for (const group of groups) {
          if (group.name === groupName) {
              return group;
          }
  
          if (group.children) {
              const result = findGroup(group.children, groupName);
              if (result) {
                  return result;
              }
          }
      }
  
      return null;
  };

    const findParentName = (groups, groupName, parent = null) => {
        for (const group of groups) {
            if (group.name === groupName) {
                return parent ? parent.name : null;
            }
    
            if (group.children) {
                const result = findParentName(group.children, groupName, group);
                if (result) {
                    return result;
                }
            }
        }
    
        return null;
    };
  


export { 
    findGroup,
    findParentName,
    getToken, 
    removeToken, 
    setToken,  
    getRGBColor,
    getAccessibleColor,
    getUserId,

};