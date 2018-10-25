export default class LinksHelper {
  constructor () {
    this.prevList = []
    this.nextList = []
  }

  static addLink (arr, elem) {
    let index = arr.indexOf(elem)
    if (index !== -1) arr.splice(index, 1)
    if (elem) arr.push(elem)
  }

  addPrev (link) {
    LinksHelper.addLink(this.prevList, link)
  }

  addNext (link) {
    LinksHelper.addLink(this.nextList, link)
  }

  static moveLink (link, popArr, pushArr) {
    let temp = popArr.length === 1 ? popArr[0] : popArr.pop()
    if (temp && link) {
      LinksHelper.addLink(pushArr, link)
    }
    return temp
  }

  popPrev (link) {
    return LinksHelper.moveLink(link, this.prevList, this.nextList)
  }

  popNext (link) {
    return LinksHelper.moveLink(link, this.nextList, this.prevList)
  }
}
