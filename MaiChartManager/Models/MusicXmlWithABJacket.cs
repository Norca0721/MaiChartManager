﻿using System.Xml;
using Sitreamai.Models;

namespace MaiChartManager.Models;

public class MusicXmlWithABJacket(string filePath, string gamePath, string assetDir) : MusicXml(filePath, gamePath)
{
    public string? AssetBundleJacket => StaticSettings.AssetBundleJacketMap.GetValueOrDefault(NonDxId);
    public string? PseudoAssetBundleJacket => StaticSettings.PseudoAssetBundleJacketMap.GetValueOrDefault(NonDxId);
    public string AssetDir => assetDir;

    // 在 mod 里文件的 jacket 是优先的
    public new bool HasJacket => JacketPath is not null || AssetBundleJacket is not null || PseudoAssetBundleJacket is not null;

    public new static MusicXmlWithABJacket CreateNew(int id, string gamePath, string assetDir)
    {
        var old = MusicXml.CreateNew(id, gamePath, assetDir);
        return new MusicXmlWithABJacket(old.FilePath, old.GamePath, assetDir);
    }

    public bool isAcbAwbExist => StaticSettings.AcbAwb.ContainsKey($"music{NonDxId:000000}.acb") && StaticSettings.AcbAwb.ContainsKey($"music{NonDxId:000000}.awb");

    public XmlDocument GetInnerXmlClone()
    {
        return (XmlDocument)xmlDoc.Clone();
    }

    public XmlDocument GetXmlWithoutEventsAndRights()
    {
        var clone = GetInnerXmlClone();
        var root = clone.SelectSingleNode("/MusicData");

        root.SelectSingleNode("rightsInfoName/id").InnerText = "0";
        root.SelectSingleNode("eventName/id").InnerText = "1";
        root.SelectSingleNode("eventName2/id").InnerText = "0";
        root.SelectSingleNode("subEventName/id").InnerText = "0";
        root.SelectSingleNode("lockType").InnerText = "0";
        root.SelectSingleNode("subLockType").InnerText = "0";

        return clone;
    }

    public List<string> Problems
    {
        get
        {
            var res = new List<string>();
            if (!isAcbAwbExist)
            {
                res.Add("音频 ACB / AWB 缺失");
            }

            if (StaticSettings.GenreList.All(it => it.Id != GenreId))
            {
                res.Add("无效的流派");
            }

            if (StaticSettings.VersionList.All(it => it.Id != AddVersionId))
            {
                res.Add("无效的版本");
            }

            if (Charts.All(it => !it.Enable))
            {
                res.Add("没有启用的谱面");
            }

            if (GenreId == 107 && !Charts[0].Enable)
            {
                res.Add("宴会场必须启用绿谱");
            }

            if (GenreId == 107 && Id < 100000)
            {
                res.Add("宴会场歌曲的 ID 小于 100000");
            }

            return res;
        }
    }
}
