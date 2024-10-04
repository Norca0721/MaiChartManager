import { defineComponent, h, PropType } from "vue";
import { CustomKeyMapConfig, KeyCodeID } from "@/client/apiGen";
import { NFlex, NFormItem, NGrid, NGridItem, NSelect, NSwitch } from "naive-ui";

const options = Object.entries(KeyCodeID).map(([key, value]) => ({label: key, value}))

export default defineComponent({
  props: {
    config: {type: Object as PropType<CustomKeyMapConfig>, required: true},
  },
  setup(props) {
    return () => <div>
      <NFormItem label="启用此功能" labelPlacement="left" labelWidth="10em">
        <NFlex vertical class="w-full ws-pre-line">
          <NFlex class="h-34px" align="center">
            <NSwitch v-model:value={props.config.enable}/>
          </NFlex>
          这里的设置无论你是否启用了 segatools 的 io4 模拟都会工作
        </NFlex>
      </NFormItem>
      <NGrid cols={2}>
        <NGridItem>
          {
            new Array(8).fill(0).map((_, i) => <NFormItem key={i} label={`1P 按键 ${i + 1}`} labelPlacement="left" labelWidth="10em">
              <NSelect v-model:value={props.config[`button${i + 1}_1P` as keyof CustomKeyMapConfig]} options={options}/>
            </NFormItem>)
          }
          <NFormItem label="1P 选择键" labelPlacement="left" labelWidth="10em">
            <NSelect v-model:value={props.config.select_1P} options={options}/>
          </NFormItem>
        </NGridItem>
        <NGridItem>
          {
            new Array(8).fill(0).map((_, i) => <NFormItem key={i} label={`2P 按键 ${i + 1}`} labelPlacement="left" labelWidth="10em">
              <NSelect v-model:value={props.config[`button${i + 1}_2P` as keyof CustomKeyMapConfig]} options={options}/>
            </NFormItem>)
          }
          <NFormItem label="2P 选择键" labelPlacement="left" labelWidth="10em">
            <NSelect v-model:value={props.config.select_2P} options={options}/>
          </NFormItem>
        </NGridItem>
      </NGrid>
    </div>;
  }
})