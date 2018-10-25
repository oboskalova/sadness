<template>
  <div class="containerBox" v-if="isThisScene" :style="styleObject"
    @mousedown.stop="startMove"
    @touchstart.stop="startMove"
    @click.stop="selectContainer">
    <div class="container-area">
      <img v-for="media in currentPlaylist"
        class="container-image"
        v-show="media.show"
        :key="media.id"
        :alt="media.name"
        :src="media.poster || media.src">
      <span style="display:none;">{{ scale }}</span>
      <container 
        v-for="container in containerChildren"
        :key="container.id"
        :id="container.id"
        :data="container"
        :containers="containers"
        :width="cropW / scale"
        :height="cropH / scale"
        :scale="scale"
        :active="active"
        :playlist="playlist"
        v-show="container.show">
      </container>
    </div>
    <span v-if="isActive && data.editable && (data.parent_id !== 0)">
			<span
        class="crop-line line-w"
        @mousedown="changeSize($event, false, true, 0, 1)"
        @touchstart="changeSize($event, false, true, 0, 1)">
      </span>
			<span
        class="crop-line line-a"
        @mousedown="changeSize($event, true, false, 1, 0)"
        @touchstart="changeSize($event, true, false, 1, 0)">
      </span>
			<span
        class="crop-line line-s"
        @mousedown="changeSize($event, false, true, 0, 2)"
        @touchstart="changeSize($event, false, true, 0, 2)">
      </span>
			<span 
        class="crop-line line-d" 
        @mousedown="changeSize($event, true, false, 2, 0)" 
        @touchstart="changeSize($event, true, false, 2, 0)">
      </span>
			<span 
        class="crop-point point1" 
        @mousedown="changeSize($event, true, true, 1, 1)" 
        @touchstart="changeSize($event, true, true, 1, 1)">
      </span>
			<span 
        class="crop-point point2" 
        @mousedown="changeSize($event, false, true, 0, 1)" 
        @touchstart="changeSize($event, false, true, 0, 1)">
      </span>
			<span 
        class="crop-point point3" 
        @mousedown="changeSize($event, true, true, 2, 1)" 
        @touchstart="changeSize($event, true, true, 2, 1)">
      </span>
			<span 
        class="crop-point point4" 
        @mousedown="changeSize($event, true, false, 1, 0)" 
        @touchstart="changeSize($event, true, false, 1, 0)">
      </span>
			<span 
        class="crop-point point5" 
        @mousedown="changeSize($event, true, false, 2, 0)" 
        @touchstart="changeSize($event, true, false, 2, 0)">
      </span>
			<span 
        class="crop-point point6" 
        @mousedown="changeSize($event, true, true, 1, 2)" 
        @touchstart="changeSize($event, true, true, 1, 2)">
      </span>
			<span 
        class="crop-point point7" 
        @mousedown="changeSize($event, false, true, 0, 2)" 
        @touchstart="changeSize($event, false, true, 0, 2)">
      </span>
			<span 
        class="crop-point point8" 
        @mousedown="changeSize($event, true, true, 2, 2)" 
        @touchstart="changeSize($event, true, true, 2, 2)">
      </span>
		</span>
  </div>  
</template>
<script>
  import { orderBy } from 'lodash'

  export default {
    name: 'container',
    props: ['active', 'data', 'id', 'width', 'height', 'scale', 'containers', 'playlist', 'scene'],
    data: function () {
      return {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
        canChangeX: false,
        canChangeY: false,
        changeCropTypeX: 1,
        changeCropTypeY: 1,
        cropX: 0,
        cropY: 0,
        move: true,
        moveX: 0,
        moveY: 0,
        canMove: true,
        cropOffsertX: 0,
        cropOffsertY: 0,
        cropping: false,
        cropW: 100,
        cropH: 100,
        oldData: {},
        newData: {}
      }
    },
    created () {
      this.x = this.data.x * this.scale
      this.y = this.data.y * this.scale
      this.cropW = this.data.width * this.scale
      this.cropH = this.data.height * this.scale
      this.w = this.width * this.scale
      this.h = this.height * this.scale
    },
    updated () {
      this.x = this.data.x * this.scale
      this.y = this.data.y * this.scale
      this.cropW = this.data.width * this.scale
      this.cropH = this.data.height * this.scale
      this.w = this.width * this.scale
      this.h = this.height * this.scale
    },
    computed: {
      rights () {
        console.log(this)
        return ''
        // return this.$store.getters.rightTo()
      },
      styleObject () {
        const bg = this.$props.data.background_color || ''
        return {
          top: this.y + 'px',
          left: this.x + 'px',
          width: this.cropW + 'px',
          height: this.cropH + 'px',
          background: bg
        }
      },
      isActive () {
        return (this.data.id === this.active)
      },
      isThisScene () {
        if (this.data.parent_id === 0) {
          return (this.data.id === this.scene)
        } else {
          return true
        }
      },
      containerChildren () {
        const id = this.id
        return this.containers.filter(
        function (node) {
          return node.parent_id === id
        })
      },
      currentPlaylist () {
        const id = this.id
        var plays = this.playlist.filter(
        function (node) {
          return node.container_id === id
        })
        return orderBy(plays, 'order')
      }
    },
    methods: {
      changeSize (e, w, h, typeW, typeH) {
        e.preventDefault()
        if (!this.data.editable) return
        if (this.isActive) {
          this.oldData = {}
          for (var key in this.data) {
            this.oldData[key] = this.data[key]
          }
          window.addEventListener('mousemove', this.changeCropNow)
          window.addEventListener('mouseup', this.changeCropEnd)
          window.addEventListener('touchmove', this.changeCropNow)
          window.addEventListener('touchend', this.changeCropEnd)
          this.canChangeX = w
          this.canChangeY = h
          this.changeCropTypeX = typeW
          this.changeCropTypeY = typeH
          this.cropX = e.clientX ? e.clientX : e.touches[0].clientX
          this.cropY = e.clientY ? e.clientY : e.touches[0].clientY
          this.cropOldW = this.cropW
          this.cropOldH = this.cropH
          this.cropChangeX = this.x
          this.cropChangeY = this.y
          this.canMove = false
        }
      },
      changeCropNow (e) {
        e.preventDefault()
        if (!this.data.editable) return
        var nowX = e.clientX ? e.clientX : e.touches ? e.touches[0].clientX : 0
        var nowY = e.clientY ? e.clientY : e.touches ? e.touches[0].clientY : 0
        this.$nextTick(() => {
          var fw = ~~(nowX - this.cropX)
          var fh = ~~(nowY - this.cropY)
          if (this.canChangeX) {
            if (this.changeCropTypeX === 1) {
              if (this.cropOldW - fw > 0) {
                this.cropW = this.w - this.cropChangeX - fw <= this.w ? this.cropOldW - fw : this.cropOldW + this.cropChangeX
                this.x = this.w - this.cropChangeX - fw <= this.w ? this.cropChangeX + fw : 0
              } else {
                this.cropW = Math.abs(fw) + this.cropChangeX <= this.w ? Math.abs(fw) - this.cropOldW : this.w - this.cropOldW - this.cropChangeX
                this.x = this.cropChangeX + this.cropOldW
              }
            } else if (this.changeCropTypeX === 2) {
              if (this.cropOldW + fw > 0) {
                this.cropW = this.cropOldW + fw + this.x <= this.w ? this.cropOldW + fw : this.w - this.x
                this.x = this.cropChangeX
              } else {
                this.cropW = (this.w - this.cropChangeX + Math.abs(fw + this.cropOldW)) <= this.w ? Math.abs(fw + this.cropOldW) : this.cropChangeX
                this.x = (this.w - this.cropChangeX + Math.abs(fw + this.cropOldW)) <= this.w ? this.cropChangeX - Math.abs(fw + this.cropOldW) : 0
              }
            }
          }
          if (this.canChangeY) {
            if (this.changeCropTypeY === 1) {
              if (this.cropOldH - fh > 0) {
                this.cropH = this.h - this.cropChangeY - fh <= this.h ? this.cropOldH - fh : this.cropOldH + this.cropChangeY
                this.y = this.h - this.cropChangeY - fh <= this.h ? this.cropChangeY + fh : 0
              } else {
                this.cropH = Math.abs(fh) + this.cropChangeY <= this.h ? Math.abs(fh) - this.cropOldH : this.h - this.cropOldH - this.cropChangeY
                this.y = this.cropChangeY + this.cropOldH
              }
            } else if (this.changeCropTypeY === 2) {
              if (this.cropOldH + fh > 0) {
                this.cropH = this.cropOldH + fh + this.y <= this.h ? this.cropOldH + fh : this.h - this.y
                this.y = this.cropChangeY
              } else {
                this.cropH = (this.h - this.cropChangeY + Math.abs(fh + this.cropOldH)) <= this.h ? Math.abs(fh + this.cropOldH) : this.cropChangeY
                this.y = (this.h - this.cropChangeY + Math.abs(fh + this.cropOldH)) <= this.h ? this.cropChangeY - Math.abs(fh + this.cropOldH) : 0
              }
            }
          }
          this.$store.commit('CHANGE_CONTAINER_PROPERTIES', {
            x: Number((this.x / this.scale).toFixed(0)),
            y: Number((this.y / this.scale).toFixed(0)),
            width: Number((this.cropW / this.scale).toFixed(0)),
            height: Number((this.cropH / this.scale).toFixed(0))
          })
        })
      },
      changeCropEnd (e) {
        if (!this.data.editable) return
        window.removeEventListener('mousemove', this.changeCropNow)
        window.removeEventListener('mouseup', this.changeCropEnd)
        window.removeEventListener('touchmove', this.changeCropNow)
        window.removeEventListener('touchend', this.changeCropEnd)
        this.canMove = true
        this.newData = {}
        for (var key in this.data) {
          this.newData[key] = this.data[key]
        }
        this.$store.commit('CHANGE_CONTAINER_STATE', {
          type: 'container',
          old: this.oldData,
          new: this.newData
        })
      },
      startMove (e) {
        e.preventDefault()
        if (!this.data.editable) return
        this.oldData = {}
        for (var key in this.data) {
          this.oldData[key] = this.data[key]
        }
        if (this.isActive && this.move && !this.crop) {
          if (!this.canMove) {
            return false
          }
          this.moveX = (e.clientX ? e.clientX : e.touches[0].clientX) - this.x
          this.moveY = (e.clientY ? e.clientY : e.touches[0].clientY) - this.y
          if (e.touches) {
            window.addEventListener('touchmove', this.moveImg)
            window.addEventListener('touchend', this.leaveImg)
            if (e.touches.length === 2) {
              this.touches = e.touches
              window.addEventListener('touchmove', this.touchScale)
              window.addEventListener('touchend', this.cancleTouchScale)
            }
          } else {
            window.addEventListener('mousemove', this.moveImg)
            window.addEventListener('mouseup', this.leaveImg)
          }
        }
      },
      moveImg (e) {
        e.preventDefault()
        if (!this.data.editable) return
        if (e.touches && e.touches.length === 2) {
          this.touches = e.touches
          window.addEventListener('touchmove', this.touchScale)
          window.addEventListener('touchend', this.cancleTouchScale)
          window.removeEventListener('touchmove', this.moveImg)
          return false
        }
        var nowX = e.clientX ? e.clientX : e.touches[0].clientX
        var nowY = e.clientY ? e.clientY : e.touches[0].clientY
        this.$nextTick(() => {
          var mx = ~~(nowX - this.moveX)
          var my = ~~(nowY - this.moveY)
          var changed = false
          if (mx >= 0 && (this.cropW + mx) <= this.w) {
            this.x = mx
            changed = true
          }
          if (my >= 0 && (this.cropH + my) <= this.h) {
            this.y = my
            changed = true
          }
          if (changed) {
            this.$store.commit('CHANGE_CONTAINER_PROPERTIES', {
              x: Number((this.x / this.scale).toFixed(0)),
              y: Number((this.y / this.scale).toFixed(0)),
              width: Number((this.cropW / this.scale).toFixed(0)),
              height: Number((this.cropH / this.scale).toFixed(0))
            })
          }
        })
      },
      leaveImg (e) {
        if (!this.data.editable) return
        window.removeEventListener('mousemove', this.moveImg)
        window.removeEventListener('touchmove', this.moveImg)
        window.removeEventListener('mouseup', this.leaveImg)
        window.removeEventListener('touchend', this.leaveImg)
        this.newData = {}
        for (var key in this.data) {
          this.newData[key] = this.data[key]
        }
        this.$store.commit('CHANGE_CONTAINER_STATE', {
          type: 'container',
          old: this.oldData,
          new: this.newData
        })
      },
      selectContainer: function () {
        if (!this.data.editable) return
        if (this.active !== this.data.id) {
          this.$store.dispatch('changeCurrentContainer', this.data.id)
          this.$store.commit('GET_CONTAINER_PROPERTIES', this.data.id)
        }
      }
    }
  }
</script>
<style scoped>
  .containerBox{
    position: absolute;
    color: #000;
    border: 2px solid #00b1b7a6; 
  }
  .crop-line {
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;
		opacity: .1;
	}
	.line-w {
		top: -3px;
    left: 0;
    height: 5px;
    cursor: n-resize;
	}
	.line-a {
		top: 0;
    left: -3px;
    width: 5px;
    cursor: w-resize;
	}
	.line-s {
		bottom: -3px;
		left: 0;
		height: 5px;
		cursor: s-resize;
	}
	.line-d {
		top: 0;
    right: -3px;
    width: 5px;
    cursor: e-resize;
	}
	.crop-point {
		position: absolute;
		width: 8px;
    height: 8px;
    opacity: .75;
    background-color: #00b0b7;
		border-radius: 100%;
	}
	.point1 {
		top: -4px;
    left: -4px;
    cursor: nw-resize;
	}
	.point2 {
		top: -5px;
    left: 50%;
    margin-left: -3px;
    cursor: n-resize;
	}
	.point3 {
		top: -4px;
    right: -4px;
    cursor: ne-resize;
	}
	.point4 {
		top: 50%;
    left: -4px;
    margin-top: -3px;
    cursor: w-resize;
	}
	.point5 {
		top: 50%;
    right: -4px;
    margin-top: -3px;
    cursor: w-resize;
	}
	.point6 {
		bottom: -5px;
		left: -4px;
		cursor: sw-resize;
	}
	.point7 {
		bottom: -5px;
		left: 50%;
		margin-left: -3px;
		cursor: s-resize;
	}
	.point8 {
		bottom: -5px;
		right: -4px;
		cursor: nw-resize;
	}
  .container-image {
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    display: block;
    position: absolute;
    transform: translate(-50%, -50%);
    object-fit: cover;
  }
</style>
