<template>
  <el-dialog title="配置维度" :visible.sync="formVisible" width="50%">
    <el-form ref="dimensionForm"
             :rules="rules" :model="form"
             label-width="120px" size="small">
      <el-form-item label="聚合字段" prop="tmp1">
        <el-select v-model="form.tmp1" value-key="key"
                   style="width:100%;" placeholder="请选择聚合字段"
                   filterable>
          <el-option-group
            v-for="([joinIndex,entity]) in entityFieldOptions"
            :key="joinIndex"
            :label="entity.title+'('+entity.tableName+')'">
            <el-option
              v-for="field in entity.fieldList"
              :key="field.fieldId"
              :label="field.fieldDesc+'('+field.fieldName+')'"
              :value="{
                key: joinIndex+'_'+field.fieldId,
                field: field,
                joinIndex: joinIndex
              }">
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item label="粒度" prop="tmp2">
        <el-select v-model="form.tmp2" value-key="value"
                   style="width:100%;">
          <el-option
            v-for="option in granularityOptions"
            :key="option.value"
            :label="option.label"
            :value="option">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit()">确定</el-button>
        <el-button v-if="edit" type="danger" @click="remove()">删除</el-button>
        <el-button @click="cancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import chartGranularity from '@/utils/options-chart-granularity'
import dimensionModel from './dimensionModel'

export default {
  name: 'dimension-form',
  data () {
    return {
      edit: false,
      position: 0,
      formVisible: false,
      entityFieldOptions: [],
      // 最终返回给调用组件的表单数据
      form: dimensionModel.initFormBean(),
      oldForm: null,
      rules: dimensionModel.getRules()
    }
  },
  computed: {
    /**
     * 当前选中字段是否数字类型
     */
    isNumberField () {
      if (this.form.tmp1.field) {
        return ['Integer', 'Short', 'Long', 'Double', 'Float', 'BigDecimal']
          .indexOf(this.form.tmp1.field.jfieldType) > -1
      }
      return false
    },
    /**
     * 粒度选项
     */
    granularityOptions () {
      if (this.form.tmp1.field) {
        return chartGranularity.getGranularityOptions(this.form.tmp1.field.jfieldType)
      }
      return []
    }
  },
  methods: {
    /**
     * 显示表单窗口
     * @param entityFieldOptions 可选的dimension字段
     * @param formBean 编辑的dimension，如果新增则为空
     * @param position 当前编辑的dimension在数组中的位置
     */
    show (entityFieldOptions, formBean, position) {
      this.position = position
      this.entityFieldOptions = entityFieldOptions
      if (formBean) {
        this.edit = true
        this.oldForm = formBean
        this.form = Object.assign({}, formBean)
      } else {
        this.edit = false
        this.form = dimensionModel.initFormBean()
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.dimensionForm.clearValidate()
      })
    },
    submit () {
      this.$refs.dimensionForm.validate()
        .then(() => {
          dimensionModel.repairDimensionForSubmit(this.form)
          this.$emit('submit', this.position, this.form)
          this.formVisible = false
        })
    },
    remove () {
      this.$emit('remove', this.position, this.form)
      this.formVisible = false
    },
    cancel () {
      this.formVisible = false
    }
  }
}
</script>

<style lang="scss">
</style>
