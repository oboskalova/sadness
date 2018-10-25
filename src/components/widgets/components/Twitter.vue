<template>
  <div ref="blockParent" class="tw-block-parent" style="width: 100%; height: 100%; overflow: hidden;">
    <div class="timeline-TweetList-tweet" style="width: 100%; height: 100%;">
      <div class="timeline-Tweet" :style="tweetStyle">
        <div class="header">
            <img class="profile-image" v-if="content.isAvatar" :src="tweet.profileImage"> 
            <div class="user-details">  
              <span class="display-name">{{tweet.displayName}}</span><br>
              <span class="screen-name">@{{tweet.screenName}}</span> 
              <img class="twitter-logo" src="data:image/svg+xml;base64,PHN2ZyBpZD0iTG9nb19GSVhFRCIgZGF0YS1uYW1lPSJMb2dvIOKAlCBGSVhFRCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNDAwIDQwMCI+PGRlZnM+PHN0eWxlPi5jbHMtMXtmaWxsOm5vbmU7fS5jbHMtMntmaWxsOiMxZGExZjI7fTwvc3R5bGU+PC9kZWZzPjx0aXRsZT5Ud2l0dGVyX0xvZ29fQmx1ZTwvdGl0bGU+PHJlY3QgY2xhc3M9ImNscy0xIiB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIvPjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTE1My42MiwzMDEuNTljOTQuMzQsMCwxNDUuOTQtNzguMTYsMTQ1Ljk0LTE0NS45NCwwLTIuMjIsMC00LjQzLS4xNS02LjYzQTEwNC4zNiwxMDQuMzYsMCwwLDAsMzI1LDEyMi40N2ExMDIuMzgsMTAyLjM4LDAsMCwxLTI5LjQ2LDguMDcsNTEuNDcsNTEuNDcsMCwwLDAsMjIuNTUtMjguMzcsMTAyLjc5LDEwMi43OSwwLDAsMS0zMi41NywxMi40NSw1MS4zNCw1MS4zNCwwLDAsMC04Ny40MSw0Ni43OEExNDUuNjIsMTQ1LjYyLDAsMCwxLDkyLjQsMTA3LjgxYTUxLjMzLDUxLjMzLDAsMCwwLDE1Ljg4LDY4LjQ3QTUwLjkxLDUwLjkxLDAsMCwxLDg1LDE2OS44NmMwLC4yMSwwLC40MywwLC42NWE1MS4zMSw1MS4zMSwwLDAsMCw0MS4xNSw1MC4yOCw1MS4yMSw1MS4yMSwwLDAsMS0yMy4xNi44OCw1MS4zNSw1MS4zNSwwLDAsMCw0Ny45MiwzNS42MiwxMDIuOTIsMTAyLjkyLDAsMCwxLTYzLjcsMjJBMTA0LjQxLDEwNC40MSwwLDAsMSw3NSwyNzguNTVhMTQ1LjIxLDE0NS4yMSwwLDAsMCw3OC42MiwyMyIvPjwvc3ZnPgo=">
            </div>
        </div>
        <div class="body">
          <div class="tweet-text" v-html="tweet.text"></div>
          <!-- <div><b-img fluid :src="content.image" /></div> -->
          <span v-show="content.isDate" class="tweet-time">{{tweet.date}}</span>
          <div class="tweet-stats"> 
            <span v-show="content.isComments">
              <img class="stat-icon" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAq1BMVEUAAAD////Z2dnT09PIyMjIyMjCwsLCwsK6urqysrKpqamgoKCZmZmRkZGJiYmBgYF2dnZiYmJra2tYWFhiYmJYWFhFRUVQUFBPT089PT04ODhFRUUzMzMwMDAsLCw4ODgoKCgzMzMwMDAhISEeHh4sLCwoKCgWFhYmJiYTExMhISEeHh4NDQ0WFhYTExMAAAANDQ0AAAAeHh4hISEmJiYoKCgsLCwwMDAzMzPw042JAAAAMnRSTlMAAAcNGBoeISkyO0ZMVV5mdH5+h4mSm5udo6eora+ztbe7vr/BwsbJyc3P0dPa3t/l8lY5plYAAAKDSURBVHja7dLZctNAEEbhxsEQ4xWISViNJ0g4GmQEsa15/yfjxlhFjQp00VroOucNvv5bnlgPIUKECBEiRIgQIUKECBEiRIgQIUKECBEiRIgQIUKECBEiRIgQYcdCOTddre9u++5uvXoh53SFo3WxO5VD6JQVNy0I5/tTGE7JfqYtXPkwrPKFrnBWAQdDnKgKizC8ck3hq2SAwt1cUejDACs3esLrLAyxXE84P1aH67/wOz9WEy4vwo9ve+/dhfh43YLwi/Te058IESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIESJEiBAhQoQIERoU3kvvPXtsQbi4CD98ffhr3z5JXa+/P6h1H1oQzg6hYeWbWuDn0Eb+Sk049s2F3QGDFzWhZM2F3QFPN4rCZdpY2Bkw5M8VhbJvLOwMmNyKpnBSNBV2BSxzURXKtGgo7Ajo8itloUz2aSNhJ8Ay24poC0WWuT8c64uEdcDyqNQh30xFWXhuPFvUl0bCGJi8ny90mo5EtIX/ah8JY+BGVOtfGANNCWPgVowJ4wVNCWOgE2PC+EUtCWOg24opYQxMxJgwXtCYMF7QmvDln0AnxoShLKMFjQlDtKBloUvFttAlYlRYLWhUWAFtC10itoVuJ0aF1YJGhdWCtoUuFdtCl4ltoduJUWEFtC10mRgVVgsaFVYLWhVWC5oWOi+2hS4T20Lnxbaw9GJb6PzItrDMRUwLi2xkXPhjJMaFYxmy8H8OIUKECBEiRIgQIUKECBEiRIgQIUKECBEiRIgQIUKECBEiRIgQYbf9AjAhxirlTTeTAAAAAElFTkSuQmCC">
              <span class="stat">{{tweet.commCount}}</span>
            </span>
            <span v-show="content.isRetweets">
              <img class="stat-icon" src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNzc3IiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSI0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0xOSA4bC00IDRoM2MwIDMuMzEtMi42OSA2LTYgNi0xLjAxIDAtMS45Ny0uMjUtMi44LS43bC0xLjQ2IDEuNDZDOC45NyAxOS41NCAxMC40MyAyMCAxMiAyMGM0LjQyIDAgOC0zLjU4IDgtOGgzbC00LTR6TTYgMTJjMC0zLjMxIDIuNjktNiA2LTYgMS4wMSAwIDEuOTcuMjUgMi44LjdsMS40Ni0xLjQ2QzE1LjAzIDQuNDYgMTMuNTcgNCAxMiA0Yy00LjQyIDAtOCAzLjU4LTggOEgxbDQgNCA0LTRINnoiLz4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KPC9zdmc+Cg==">
              <span class="stat">{{tweet.rettCount}}</span> 
            </span>
            <span v-show="content.isLikes">
              <img class="stat-icon" src="data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjNzc3IiBoZWlnaHQ9IjQ4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSI0OCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz4KICAgIDxwYXRoIGQ9Ik0xNi41IDNjLTEuNzQgMC0zLjQxLjgxLTQuNSAyLjA5QzEwLjkxIDMuODEgOS4yNCAzIDcuNSAzIDQuNDIgMyAyIDUuNDIgMiA4LjVjMCAzLjc4IDMuNCA2Ljg2IDguNTUgMTEuNTRMMTIgMjEuMzVsMS40NS0xLjMyQzE4LjYgMTUuMzYgMjIgMTIuMjggMjIgOC41IDIyIDUuNDIgMTkuNTggMyAxNi41IDN6bS00LjQgMTUuNTVsLS4xLjEtLjEtLjFDNy4xNCAxNC4yNCA0IDExLjM5IDQgOC41IDQgNi41IDUuNSA1IDcuNSA1YzEuNTQgMCAzLjA0Ljk5IDMuNTcgMi4zNmgxLjg3QzEzLjQ2IDUuOTkgMTQuOTYgNSAxNi41IDVjMiAwIDMuNSAxLjUgMy41IDMuNSAwIDIuODktMy4xNCA1Ljc0LTcuOSAxMC4wNXoiLz4KPC9zdmc+Cg==">
              <span class="stat icon">{{tweet.likesCount}}</span> 
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tweet',
  props: ['content', 'options'],
  created () {
    this.startNext()
    console.log(this.content)
  },
  beforeDestroy () {
    clearInterval(this.nextTimerId)
  },
  data () {
    return {
      defaultWidth: 500,
      tweetInd: 0,
      nextTimerId: null
    }
  },
  computed: {
    tweetStyle () {
      let s = this.options.width / this.defaultWidth
      return {
        width: `${this.defaultWidth}px`,
        transform: `scaleX(${s}) scaleY(${s})`,
        transformOrigin: '0 0'
      }
    },
    tweet () {
      return this.content.tweetList[this.tweetInd]
    }
  },
  methods: {
    startNext () {
      if (this.content.nextTime) {
        this.nextTimerId = setInterval(() => {
          this.tweetInd += 1
          if (this.tweetInd >= this.content.tweetList.length) {
            this.tweetInd = 0
          }
        }, this.content.nextTime * 1000)
      }
    }
  }
}
</script>

<style scoped>
  .tw-block-parent {
    width: 500px;
    font: 14px/1.4 Roboto, Helvetica, Arial, Tahoma, sans-serif;
    font-weight: 300;
    color: #292F33;
  }
  .timeline-TweetList-tweet {
    border-top: 1px solid rgba(15, 70, 100, 0.12);
    pointer-events: none;
  }
  .timeline-TweetList-tweet:first-of-type {
    border-top: none;
  }
  .timeline-Tweet {
    position: relative;
    padding: 10px;
  }
  .timeline-Tweet a,
  .timeline-Tweet .link {
    color: #3b94d9;
    text-decoration: none;
    outline: 0;
  }
  .timeline-Tweet a:hover,
  .timeline-Tweet .link:hover {
    color: #55acee;
  }
  .profile-image {
    border: 1px solid rgba(255, 255, 255, 0.2);
    float: left;
    width: 11%;
    border-radius: 100%;
    margin-right: 1%;
  }
  .user-details {
    margin-top: 1%;
    width: 88%;
    text-align: left;
    display: block;
    margin-bottom: 11px;
  }
  .display-name {
    font-weight: 700;
  }
  .twitter-logo {
    position: absolute;
    top: 0%;
    right: 3%;
    width: 12%;
    text-align: right;
  }
  .header {
    position: relative;
    margin-bottom: 2px;
    padding-left: 2%;
    overflow: hidden;
  }
  .timeline-Tweet .body {
    padding-left: 2%;
    width: 95%;
    word-wrap: break-word;
  }
  .tweet-text {
    font-size: 1.3vw;
    margin-bottom: 2%;
  }
  .tweet-time {
    font-size: 1vw;
  }
  .tweet-stats {
    margin-top: 1%;
    font-size: 1vw;
  }
  .stat-icon {
    width: 4%;
  }
</style>

