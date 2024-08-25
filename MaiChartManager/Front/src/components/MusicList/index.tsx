import { defineComponent, onMounted } from "vue";
import api from "@/client/api";
import { MusicBrief } from "@/client/apiGen";
import { NFlex, NSelect, NVirtualList } from "naive-ui";
import MusicEntry from "@/components/MusicList/MusicEntry";
import { assetDirs, musicList, selectedADir, selectMusicId, updateMusicList } from "@/store/refs";

export default defineComponent({
  setup() {
    const refresh = async () => {
      await updateMusicList();
    }

    onMounted(async () => {
      refresh();
    });

    const setAssetsDir = async (dir: string) => {
      await api.SetAssetsDir(dir);
      selectedADir.value = dir;
      selectMusicId.value = 0;
      refresh();
    }

    return () => (
      <NFlex vertical class="h-full" size="large">
        <NSelect
          value={selectedADir.value}
          options={assetDirs.value.map(dir => ({label: dir, value: dir}))}
          onUpdate:value={setAssetsDir}
        />
        <NVirtualList class="flex-1" itemSize={20 / 4 * 16} items={musicList.value}>
          {{
            default({item}: { item: MusicBrief }) {
              return (
                <MusicEntry music={item} selected={selectMusicId.value === item.id} onClick={() => selectMusicId.value = item.id!} key={item.id}/>
              )
            }
          }}
        </NVirtualList>
      </NFlex>
    )
  }
})