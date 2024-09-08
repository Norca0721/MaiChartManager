import { defineComponent, onMounted } from 'vue';
import { NFlex, NScrollbar, useNotification } from "naive-ui";
import MusicList from "@/components/MusicList";
import GenreVersionManager from "@/components/GenreVersionManager";
import { globalCapture, selectedADir, updateAddVersionList, updateAssetDirs, updateGenreList, updateSelectedAssetDir, updateVersion } from "@/store/refs";
import MusicEdit from "@/components/MusicEdit";
import MusicSelectedTopRightToolbar from "@/components/MusicSelectedTopRightToolbar";
import CreateMusicButton from "@/components/CreateMusicButton";
import ImportChartButton from "@/components/ImportChartButton";
import ModManager from "@/components/ModManager";
import VersionInfo from "@/components/VersionInfo";
import { captureException } from "@sentry/vue";
import AssetDirsManager from "@/components/AssetDirsManager";
import RefreshAllButton from "@/components/RefreshAllButton";

export default defineComponent({
  setup() {
    const notification = useNotification();

    onMounted(async () => {
      addEventListener("unhandledrejection", (event) => {
        console.log(event)
        captureException(event.reason?.error || event.reason, {
          tags: {
            context: 'unhandledrejection'
          }
        })
        if (import.meta.env.DEV)
          notification.error({title: '未处理错误', content: event.reason?.error?.message || event.reason?.message});
      });
      try {
        await Promise.all([
          updateGenreList(),
          updateAddVersionList(),
          updateSelectedAssetDir(),
          updateAssetDirs(),
          updateVersion()
        ])
      } catch (err) {
        globalCapture(err, "初始化失败")
      }
    })
  },
  render() {
    return <NFlex justify="center">
      <div class="grid cols-[40em_1fr] w-[min(90rem,100%)]">
        <div class="p-xy h-100vh">
          <MusicList/>
        </div>
        <NFlex vertical class="p-xy h-100vh" size="large" style={{background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 16px, rgba(255, 255, 255, 0.1) calc(100% - 16px), transparent 100%)'}}>
          <NFlex class="shrink-0">
            <AssetDirsManager/>
            {selectedADir.value !== 'A000' && <>
              <GenreVersionManager type="genre"/>
              <GenreVersionManager type="version"/>
            </>}
            <ModManager/>
            <RefreshAllButton/>

            <div class="grow-1"/>

            {selectedADir.value !== 'A000' && <>
              <MusicSelectedTopRightToolbar/>
              <CreateMusicButton/>
              <ImportChartButton/>
            </>}
            <VersionInfo/>
          </NFlex>
          <NScrollbar class="grow-1">
            <MusicEdit/>
          </NScrollbar>
        </NFlex>
      </div>
    </NFlex>;
  },
});
