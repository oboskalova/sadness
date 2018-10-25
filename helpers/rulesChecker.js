const RulesChecker = {
  canUserDo (type, undertype, store) {
    var flag = false
    const groups = store.userGroup
    groups.forEach(el => {
      for (let key in el) {
        if (key === 'admin' && el[key] === true) {
          flag = true
        }
        if (key === type && el[key] === true) {
          flag = true
        }
        if (undertype) {
          if (key === undertype) {
            if (el[key]) {
              if (undertype === 'players' && type === '') {
                flag = true
              }
              let obj = JSON.parse(el[key])
              for (let key2 in obj) {
                if (key2 === type && obj[key2] === true) {
                  flag = true
                }
              }
            }
          }
        }
      }
    })
    const custom = JSON.parse(store.passport.custom)
    for (let key in custom) {
      if (key === type && custom[key] === true) {
        flag = true
      }
      if (undertype) {
        if (key === undertype) {
          if (custom[key]) {
            if (undertype === 'players' && type === '') {
              flag = true
            }
            let obj = JSON.parse(custom[key])
            for (let key2 in obj) {
              if (key2 === type && obj[key2] === true) {
                flag = true
              }
            }
          }
        }
      }
    }
    console.log(undertype, type, flag)
    return flag
  }
}

export default RulesChecker