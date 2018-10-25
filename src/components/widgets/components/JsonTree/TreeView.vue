<template>
  <div class="tree-view-wrapper">
    <tree-view-item class="tree-view-item-root" :data="data" :max-depth="allOptions.maxDepth" :current-depth="0" :modifiable="allOptions.modifiable" :link="allOptions.link" @change-data="onChangeData"></tree-view-item>
  </div>
</template>

<script>
  /* eslint-disable */
  import _ from 'lodash'
  import TreeViewItem from './TreeViewItem.vue'

  export default {
    components:{
      TreeViewItem
    },
  	name: "tree-view",
    props: ["data", "options"],
    data () {
      return {
        root: null
      }
    },
    methods: {

      // treeChange () {
      //   console.log('TreeView', 'treeChange')
      //   this.$emit('treeChange', this.root, this.checks)
      // },

    	// Transformer for the non-Collection types,
      // like String, Integer of Float
      transformValue: function(idParam, valueToTransform, keyForValue){
        let isCheck = this.checks[idParam] === true ? true : false
      	return {
          id: idParam,
        	key: keyForValue,
          type: "value",
          value: valueToTransform,
          isCheck: isCheck
        }
      },

    	// Since we use lodash, the _.map method will work on
      // both Objects and Arrays, returning either the Key as
      // a string or the Index as an integer
    	generateChildrenFromCollection: function(idParam, collection){
  			return _.map(collection, (value, keyOrIndex)=>{
            idParam += 1
            if (this.isObject(value)) {
              return this.transformObject(idParam, value, keyOrIndex);
            }
            if (this.isArray(value)) {
              return this.transformArray(idParam, value, keyOrIndex);
            }
            if (this.isValue(value)) {
              return this.transformValue(idParam, value, keyOrIndex);
            }
          }) ;
      },

    	// Transformer for the Array type
      transformArray: function(idParam, arrayToTransform, keyForArray){
        let isCheck = this.checks[idParam] === true ? true : false
      	return {
          id: idParam,
        	key: keyForArray,
          type: "array",
          children: this.generateChildrenFromCollection(idParam, arrayToTransform),
          isCheck: isCheck
        }
      },

      // Transformer for the Object type
    	transformObject: function(idParam, objectToTransform, keyForObject, isRootObject = false){
        let isCheck = this.checks[idParam] === true ? true : false
        let obj = {
          id: idParam,
        	key: keyForObject,
        	type: "object",
          isRoot: isRootObject,
          children: this.generateChildrenFromCollection(idParam, objectToTransform),
          isCheck: isCheck
        }
        if (isRootObject) this.root = obj
        return obj
      },

      // Helper Methods for value type detection
      isObject: function(value){
      	return _.isPlainObject(value);
      },

      isArray: function(value){
      	return _.isArray(value);
      },

      isValue: function(value){
      	return !this.isObject(value) && !this.isArray(value);
      },

      onChangeData: function(path, value) {
        let lastKey = _.last(path)
        path = _.dropRight(_.drop(path))

        let data = _.cloneDeep(this.data)
        let targetObject = data
        _.forEach(path, (key) => {
          targetObject = targetObject[key]
        })

        if (targetObject[lastKey] != value) {
          targetObject[lastKey] = value
          this.$emit('change-data', data)
        }
      },
    },
    computed: {
      allOptions: function(){
        return _.extend({}, {
          rootObjectKey:  "root",
          maxDepth:       4,
          modifiable:     false,
          link: false
        }, (this.options || {}) )
      },
    	parsedData: function(){


      	// Take the JSON data and transform
        // it into the Tree View DSL

        // this.checks

        if (this.isValue(this.data)) {
          return this.transformValue(0, this.data, this.allOptions.rootObjectKey);
        }

        return this.transformObject(0, this.data, this.allOptions.rootObjectKey, true);

      }
    }
  };
</script>

<style scoped>

.tree-view-wrapper {
  overflow: auto;
  width: 100%;
}

/* Find the first nested node and override the indentation */
.tree-view-item-root > .tree-view-item-leaf > .tree-view-item {
  margin-left: 0!important;
}

/* Root node should not be indented */
.tree-view-item-root {
  margin-left: 0!important;
}

.treeBtn {
  padding: 6px 10px !important;
}

</style>
