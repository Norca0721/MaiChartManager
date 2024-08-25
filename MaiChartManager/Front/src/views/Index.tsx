import { defineComponent, onMounted } from 'vue';
import { NFlex, NScrollbar } from "naive-ui";
import MusicList from "@/components/MusicList";
import GenreVersionManager from "@/components/GenreVersionManager";
import { updateAddVersionList, updateAssetDirs, updateGenreList, updateSelectedAssetDir } from "@/store/refs";
import MusicEdit from "@/components/MusicEdit";
import MusicSelectedTopRightToolbar from "@/components/MusicSelectedTopRightToolbar";
import CreateMusicButton from "@/components/CreateMusicButton";

export default defineComponent({
  setup() {
    onMounted(updateGenreList)
    onMounted(updateAddVersionList)
    onMounted(updateSelectedAssetDir)
    onMounted(updateAssetDirs)
  },
  render() {
    return <NFlex justify="center">
      <div class="grid cols-[40em_1fr] select-none w-[min(90rem,100%)]">
        <div class="p-xy h-100vh">
          <MusicList/>
        </div>
        <NFlex vertical class="p-xy h-100vh" size="large">
          <NFlex class="shrink-0">
            <GenreVersionManager type="genre"/>
            <GenreVersionManager type="version"/>

            <div class="grow-1"/>

            <MusicSelectedTopRightToolbar/>
            <CreateMusicButton/>
          </NFlex>
          <NScrollbar class="grow-1">
            <MusicEdit/>
          </NScrollbar>
        </NFlex>
      </div>
    </NFlex>;
  },
});